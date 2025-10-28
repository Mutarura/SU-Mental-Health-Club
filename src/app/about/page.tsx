'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { CouncilLeader } from '../../types/database.types';
import type { User } from '@supabase/supabase-js';
import {
  LightbulbIcon,
  HeartIcon,
  BuildingIcon,
  BalanceIcon,
  UserIcon,
  PeopleIcon,
} from '../../components/icons';

const ROLES = ['President', 'Vice President', 'Secretary'] as const;
type Role = typeof ROLES[number];

type LeaderForm = {
  name: string;
  email: string;
  bio: string;
  year: string;
  linkedin_url: string;
  photo_url: string;
};

export default function AboutPage() {
  const [leaders, setLeaders] = useState<Record<Role, CouncilLeader | null>>({
    President: null,
    'Vice President': null,
    Secretary: null,
  });
  const [forms, setForms] = useState<Record<Role, LeaderForm>>({
    President: { name: '', email: '', bio: '', year: '', linkedin_url: '', photo_url: '' },
    'Vice President': { name: '', email: '', bio: '', year: '', linkedin_url: '', photo_url: '' },
    Secretary: { name: '', email: '', bio: '', year: '', linkedin_url: '', photo_url: '' },
  });
  const [showEdit, setShowEdit] = useState<Record<Role, boolean>>({
    President: false,
    'Vice President': false,
    Secretary: false,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('council_leaders')
          .select('*')
          .in('role', ROLES);

        if (error) {
          setMessage(error.message || 'Failed to load council leaders');
        } else {
          const byRole: Record<Role, CouncilLeader | null> = {
            President: null,
            'Vice President': null,
            Secretary: null,
          };
          data?.forEach((l: CouncilLeader) => {
            const role = l.role as Role;
            if (ROLES.includes(role)) {
              byRole[role] = l;
              setForms((prev) => ({
                ...prev,
                [role]: {
                  name: l.name || '',
                  email: l.email || '',
                  bio: l.bio || '',
                  year: l.year || '',
                  linkedin_url: l.linkedin_url || '',
                  photo_url: l.photo_url || '',
                },
              }));
            }
          });
          setLeaders(byRole);
        }
      } finally {
        setLoading(false);
      }
    };

    // Check if user is authenticated and is an admin via user_metadata
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user || null);
      setIsAdmin(Boolean(user?.user_metadata?.role === 'admin'));
    };

    // Subscribe to real-time updates for council_leaders
    const subscribeRealtime = () => {
      if (!supabase) return;
      const channel = supabase
        .channel('council_leaders_changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'council_leaders' }, (payload: any) => {
          const l = payload.new as CouncilLeader;
          const role = l.role as Role;
          if (!ROLES.includes(role)) return;
          setLeaders((prev) => ({ ...prev, [role]: l }));
          setForms((prev) => ({
            ...prev,
            [role]: {
              name: l.name || '',
              email: l.email || '',
              bio: l.bio || '',
              year: l.year || '',
              linkedin_url: l.linkedin_url || '',
              photo_url: l.photo_url || '',
            },
          }));
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'council_leaders' }, (payload: any) => {
          const l = payload.new as CouncilLeader;
          const role = l.role as Role;
          if (!ROLES.includes(role)) return;
          setLeaders((prev) => ({ ...prev, [role]: l }));
          setForms((prev) => ({
            ...prev,
            [role]: {
              name: l.name || '',
              email: l.email || '',
              bio: l.bio || '',
              year: l.year || '',
              linkedin_url: l.linkedin_url || '',
              photo_url: l.photo_url || '',
            },
          }));
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'council_leaders' }, (payload: any) => {
          const l = payload.old as CouncilLeader;
          const role = l.role as Role;
          if (!ROLES.includes(role)) return;
          setLeaders((prev) => ({ ...prev, [role]: null }));
          setForms((prev) => ({
            ...prev,
            [role]: { name: '', email: '', bio: '', year: '', linkedin_url: '', photo_url: '' },
          }));
        })
        .subscribe();

      return () => {
        if (supabase) supabase.removeChannel(channel);
      };
    };

    fetchLeaders();
    checkUser();
    const cleanup = subscribeRealtime();
    return cleanup;
  }, []);

  const saveLeader = async (role: Role) => {
    if (!supabase) return;
    if (!user || !isAdmin) {
      setMessage('You must be an admin to make changes');
      return;
    }
    
    const form = forms[role];
    setMessage('');
    try {
      if (leaders[role]) {
        const { error, data } = await supabase
          .from('council_leaders')
          .update({
            name: form.name,
            email: form.email,
            bio: form.bio,
            year: form.year,
            linkedin_url: form.linkedin_url || null,
            photo_url: form.photo_url || null,
          })
          .eq('id', leaders[role]!.id)
          .select();

        if (error) {
          setMessage(error.message || 'Failed to update leader');
          return;
        }
        const updated = data?.[0] as CouncilLeader;
        setLeaders((prev) => ({ ...prev, [role]: updated }));
        setMessage(`${role} updated successfully`);
      } else {
        const { error, data } = await supabase
          .from('council_leaders')
          .insert([
            {
              role,
              name: form.name,
              email: form.email,
              bio: form.bio,
              year: form.year,
              linkedin_url: form.linkedin_url || null,
              photo_url: form.photo_url || null,
            },
          ])
          .select();

        if (error) {
          setMessage(error.message || 'Failed to create leader');
          return;
        }
        const created = data?.[0] as CouncilLeader;
        setLeaders((prev) => ({ ...prev, [role]: created }));
        setMessage(`${role} created successfully`);
      }
      setShowEdit((prev) => ({ ...prev, [role]: false }));
    } catch {
      setMessage('Unexpected error saving leader');
    }
  };

  const deleteLeader = async (role: Role) => {
    if (!supabase || !leaders[role]) return;
    if (!user || !isAdmin) {
      setMessage('You must be an admin to make changes');
      return;
    }
    
    if (!confirm(`Delete ${role}?`)) return;
    setMessage('');
    try {
      const { error } = await supabase
        .from('council_leaders')
        .delete()
        .eq('id', leaders[role]!.id);

      if (error) {
        setMessage(error.message || 'Failed to delete leader');
        return;
      }
      setLeaders((prev) => ({ ...prev, [role]: null }));
      setForms((prev) => ({
        ...prev,
        [role]: { name: '', email: '', bio: '', year: '', linkedin_url: '', photo_url: '' },
      }));
      setMessage(`${role} deleted successfully`);
    } catch {
      setMessage('Unexpected error deleting leader');
    }
  };

  const roleBadge = (role: Role) => {
    const cls =
      role === 'President'
        ? 'bg-yellow-100 text-yellow-700'
        : role === 'Vice President'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-green-100 text-green-700';
    return <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${cls}`}>{role}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <header className="max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
              <BalanceIcon className="w-8 h-8 text-su-gold" />
            </div>
            <h1 className="text-3xl font-bold text-su-blue">
              Strahmore Mental Health Club
            </h1>
          </div>
          <div className="w-24 h-1 bg-su-red mx-auto mb-8"></div>
        <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
          We’re a student-led community focused on awareness, support, and resilience. Our mission is to foster open
          conversation, reduce stigma, and connect peers with resources.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
        {message && <div className="mb-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-200">{message}</div>}

        {/* Icon Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <LightbulbIcon className="w-5 h-5 text-su-blue" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700">
              To create a supportive, inclusive environment where students feel heard, valued, and empowered to prioritize
              mental health and wellbeing.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-su-red" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Our Story</h2>
            </div>
            <p className="text-gray-700">
              Started by passionate students, we’ve grown into a vibrant community offering workshops, awareness campaigns,
              and peer support circles across campus.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <BuildingIcon className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Collaboration</h2>
            </div>
            <p className="text-gray-700">
              We collaborate with the Strathmore Medical Centre for professional services and Student Affairs to ensure both peer support and
              professional referrals when needed.
            </p>
          </div>
        </section>

        {/* Club Council CRUD */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <PeopleIcon className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Club Council</h2>
          </div>



          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse h-48"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ROLES.map((role) => {
                const leader = leaders[role];
                const form = forms[role];
                return (
                  <div key={role} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            role === 'President'
                              ? 'bg-yellow-100'
                              : role === 'Vice President'
                              ? 'bg-blue-100'
                              : 'bg-green-100'
                          }`}
                        >
                          <UserIcon
                            className={`w-6 h-6 ${
                              role === 'President'
                                ? 'text-yellow-600'
                                : role === 'Vice President'
                                ? 'text-su-blue'
                                : 'text-green-600'
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{leader?.name || 'To be announced'}</h3>
                          <div className="mt-1">{roleBadge(role)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      {leader?.email && <p>Email: {leader.email}</p>}
                      {leader?.year && <p>Year: {leader.year}</p>}
                      {leader?.linkedin_url && (
                        <a href={leader.linkedin_url} target="_blank" rel="noreferrer" className="text-su-blue hover:underline">
                          LinkedIn Profile
                        </a>
                      )}
                      {leader?.bio && <p className="mt-2">{leader.bio}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Contact Us Section */}
        <section className="text-center py-12 bg-white rounded-lg shadow-xl border border-gray-200 mx-auto max-w-4xl mt-8">
          <h2 className="text-3xl font-bold text-su-blue mb-4">Get Involved!</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Have questions, suggestions, or want to join our team? Reach out to us!
          </p>
          <a
            href="mailto:mentalhealthclub@strathmore.edu"
            className="inline-block bg-su-red text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
          >
            Contact Us
          </a>
        </section>
      </main>
    </div>
  );
}
