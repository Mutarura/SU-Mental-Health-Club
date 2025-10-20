'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import type { Event, Resource, Quote, CouncilLeader } from '../../types/database.types';
import { 
  HomeIcon, 
  ChatIcon, 
  CalendarIcon, 
  BookIcon, 
  PeopleIcon, 
  UserIcon,
  DocumentIcon,
  EmailIcon,
  SunIcon
} from '../../components/icons';
import { MONTHLY_AWARENESS as DEFAULT_AWARENESS } from '../../data/monthlyAwareness';
// duplicate import removed – DEFAULT_AWARENESS already imported above

interface AdminStats {
  totalEvents: number;
  totalResources: number;
  totalQuotes: number;
  totalCouncilLeaders: number;
  totalAwareness: number;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<AdminStats>({
    totalEvents: 0,
    totalResources: 0,
    totalAwareness: 0,
    totalQuotes: 0,
    totalCouncilLeaders: 0
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Monthly Awareness states
  const [awarenessEntries, setAwarenessEntries] = useState<any[]>([]);
  const [editingAwarenessId, setEditingAwarenessId] = useState<string | null>(null);
  const [newAwareness, setNewAwareness] = useState({
    month: '',
    theme: '',
    message: '',
    resource_url: '',
    icon: 'sun' as const,
    banner_url: '',
    caption: ''
  });

  // Data arrays - only essential tables
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [councilLeaders, setCouncilLeaders] = useState<CouncilLeader[]>([]);

  // Form visibility states - only essential forms
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showCouncilLeaderForm, setShowCouncilLeaderForm] = useState(false);
  const [showAwarenessForm, setShowAwarenessForm] = useState(false);

  // Form data states - only essential forms
  const [quoteForm, setQuoteForm] = useState({ text: '', author: '' });
  const [eventForm, setEventForm] = useState({ 
    title: '', 
    slug: '',
    description: '', 
    start: '', 
    end: '',
    location: '', 
    calendar_link: '',
    image_url: '' 
  });
  const [resourceForm, setResourceForm] = useState({
    title: '',
    category: 'article' as const,
    url_or_storage_path: '',
    tags: [] as string[],
    description: '',
    image_url: ''
  });
  const [councilLeaderForm, setCouncilLeaderForm] = useState({
    name: '',
    role: '',
    bio: '',
    year: '',
    email: '',
    linkedin_url: '',
    photo_url: ''
  });

  // Editing state
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    const channel = supabase.channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, fetchResources)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, fetchQuotes)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'council_leaders' }, fetchClubCouncil)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monthly_awareness' }, fetchMonthlyAwareness)
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, []);

  // Fetch functions
  const fetchQuotes = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
    if (!error) setQuotes(data || []);
  };

  const fetchEvents = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('events').select('*').order('start', { ascending: true });
    if (!error) setEvents(data || []);
  };

  const fetchResources = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    if (!error) setResources(data || []);
  };

  const fetchClubCouncil = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('council_leaders').select('*').order('created_at', { ascending: false });
    if (!error) setCouncilLeaders(data || []);
  };

  const fetchAboutContent = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('about').select('*').single();
    if (!error && data) {
      // aboutContent state removed; nothing to set here
    }
  };

  const fetchFooterContent = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('footer').select('*').single();
    if (!error) {
      // footerContent state removed; nothing to set here
    }
  };

  const fetchTeamMembers = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: false });
    if (!error) setCouncilLeaders(data || []);
  };

  // Club Council CRUD operations
  const handleClubCouncilSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage('Database not configured');
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('council_leaders')
          .update(councilLeaderForm)
          .eq('id', editingItem.id);
        if (!error) {
          setMessage('Council leader updated successfully!');
          setEditingItem(null);
          fetchClubCouncil();
        }
      } else {
        const { data, error } = await supabase
          .from('council_leaders')
          .insert([councilLeaderForm])
          .select();
        if (!error && data) {
          setCouncilLeaders([data[0], ...councilLeaders]);
          setMessage('Council leader added successfully!');
        }
      }

      setCouncilLeaderForm({ name: '', role: '', bio: '', year: '', email: '', linkedin_url: '', photo_url: '' });
      setShowCouncilLeaderForm(false);
      fetchClubCouncil();
      fetchStats();
    } catch {
      setMessage('Error saving council leader');
    }
  };

  const deleteClubCouncilMember = async (id: string) => {
    if (!supabase) return;
    if (confirm('Are you sure you want to delete this council leader?')) {
      const { error } = await supabase.from('council_leaders').delete().eq('id', id);
      if (!error) {
        setMessage('Council leader deleted successfully!');
        fetchClubCouncil();
        fetchStats();
      }
    }
  };

  // Team Members CRUD operations
  const handleTeamMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage('Database not configured');
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('team_members')
          .update(councilLeaderForm)
          .eq('id', editingItem.id);
        if (!error) {
          setMessage('Team member updated successfully!');
          setEditingItem(null);
          await fetchTeamMembers();
        }
      } else {
        const { data, error } = await supabase.from('team_members').insert([councilLeaderForm]).select();
        if (!error && data) {
          setCouncilLeaders([data[0], ...councilLeaders]);
          setMessage('Team member added successfully!');
        }
      }

setCouncilLeaderForm({ name: '', role: '', bio: '', year: '', email: '', linkedin_url: '', photo_url: '' });
setShowCouncilLeaderForm(false);
    } catch (error) {
      setMessage('Error saving team member');
    }
  };

  const deleteTeamMember = async (id: string) => {
    if (!supabase) return;
    if (confirm('Are you sure you want to delete this team member?')) {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (!error) {
        setMessage('Team member deleted successfully!');
        fetchTeamMembers();
      }
    }
  };

  // Load data when user is authenticated
  const fetchMonthlyAwareness = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('monthly_awareness')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) setAwarenessEntries(data || DEFAULT_AWARENESS);
  };

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchQuotes();
      fetchEvents();
      fetchResources();
      fetchClubCouncil();
      fetchMonthlyAwareness();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!supabase) return;
    try {
      const [eventsRes, resourcesRes, quotesRes, councilRes, awarenessRes] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('resources').select('id', { count: 'exact' }),
        supabase.from('quotes').select('id', { count: 'exact' }),
        supabase.from('council_leaders').select('id', { count: 'exact' }),
        supabase.from('monthly_awareness').select('id', { count: 'exact' }),
      ]);

      setStats({
        totalEvents: eventsRes.count || 0,
        totalResources: resourcesRes.count || 0,
        totalAwareness: awarenessRes.count || 0,
        totalQuotes: quotesRes.count || 0,
        totalCouncilLeaders: councilRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage('Database not configured');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setAuthLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'admin'
          }
        }
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error) {
      setMessage('An error occurred during signup');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage('Database not configured');
      return;
    }

    setAuthLoading(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('quotes')
          .update(quoteForm)
          .eq('id', editingItem.id);
        if (!error) {
          setMessage('Quote updated successfully!');
          setEditingItem(null);
          // Fetch updated quotes to refresh the UI
          await fetchQuotes();
          await fetchStats();
        }
      } else {
        const { data, error } = await supabase.from('quotes').insert([quoteForm]).select();
        if (!error && data) {
          // Update local state with the new quote
          setQuotes([data[0], ...quotes]);
          setMessage('Quote added successfully!');
          // Refresh stats
          await fetchStats();
        }
      }

      setQuoteForm({ text: '', author: '' });
      setShowQuoteForm(false);
    } catch (error) {
      console.error('Error saving quote:', error);
      setMessage('Error saving quote. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const deleteQuote = async (id: string) => {
    if (!supabase) return;
    if (confirm('Are you sure you want to delete this quote?')) {
      const { error } = await supabase.from('quotes').delete().eq('id', id);
      if (!error) {
        setMessage('Quote deleted successfully!');
        fetchQuotes();
        fetchStats();
      }
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage('Database not configured');
      return;
    }

    const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      if (editingItem) {
        const updatePayload = {
          title: eventForm.title,
          description: eventForm.description,
          location: eventForm.location,
          image_url: eventForm.image_url || null,
          start: new Date(eventForm.start).toISOString(),
          end: new Date(eventForm.end).toISOString(),
        };
        const { error } = await supabase.from('events').update(updatePayload).eq('id', editingItem.id);
        if (!error) {
          setMessage('Event updated successfully!');
          setEditingItem(null);
          await fetchEvents();
          await fetchStats();
        }
      } else {
        const insertPayload = {
          title: eventForm.title,
          slug: slugify(eventForm.title),
          description: eventForm.description,
          location: eventForm.location,
          image_url: eventForm.image_url || null,
          start: new Date(eventForm.start).toISOString(),
          end: new Date(eventForm.end).toISOString(),
          calendar_link: null,
        };
        const { data, error } = await supabase.from('events').insert([insertPayload]).select();
        if (!error && data) {
          setEvents([data[0], ...events]);
          setMessage('Event added successfully!');
          await fetchStats();
        }
      }
      setEventForm({ title: '', slug: '', description: '', start: '', end: '', location: '', calendar_link: '', image_url: '' });
      setShowEventForm(false);
    } catch (error) {
      setMessage('Error saving event');
    }
  };

  const deleteEvent = async (id: string) => {
    if (!supabase) return;
    if (confirm('Are you sure you want to delete this event?')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (!error) {
        setMessage('Event deleted successfully!');
        fetchEvents();
        fetchStats();
      }
    }
  };

  // CRUD Operations for Resources
  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage('Database not configured');
      return;
    }

    try {
      const payload = {
        title: resourceForm.title,
        category: resourceForm.category || 'article',
        url_or_storage_path: resourceForm.url_or_storage_path,
        description: resourceForm.description,
        image_url: null,
        tags: [],
      };

      if (editingItem) {
        const { error } = await supabase.from('resources').update(payload).eq('id', editingItem.id);
        if (!error) {
          setMessage('Resource updated successfully!');
          setEditingItem(null);
          await fetchResources();
          await fetchStats();
        }
      } else {
        const { data, error } = await supabase.from('resources').insert([payload]).select();
        if (!error && data) {
          setResources([data[0], ...resources]);
          setMessage('Resource added successfully!');
          await fetchStats();
        }
      }

      setResourceForm({ title: '', category: 'article', url_or_storage_path: '', tags: [], description: '', image_url: '' });
      setShowResourceForm(false);
    } catch (error) {
      setMessage('Error saving resource');
    }
  };

  const deleteResource = async (id: string) => {
    if (!supabase) return;
    if (confirm('Are you sure you want to delete this resource?')) {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (!error) {
        setMessage('Resource deleted successfully!');
        fetchResources();
        fetchStats();
      }
    }
  };


  // About Content Update
  const handleAboutUpdate = async (field: 'mission_text' | 'story_text' | 'collaboration_note' | 'image_url', value: string) => {
    if (!supabase) return;
    try {
      const updateData = { [field]: value };
      const { error } = await supabase
        .from('about')
        .update(updateData)
        .eq('id', 1);
      if (!error) {
        setMessage(`${field} updated successfully!`);
        fetchAboutContent();
      }
    } catch {
      setMessage(`Error updating ${field}`);
    }
  };

  // Footer Contact Update
  const handleFooterUpdate = async (field: 'med_centre_contact' | 'club_email' | 'emergency_numbers', value: string) => {
    if (!supabase) return;
    try {
      const updateData = { [field]: value };
      const { error } = await supabase
        .from('footer')
        .update(updateData)
        .eq('id', 1);
      if (!error) {
        setMessage(`${field} updated successfully!`);
        fetchFooterContent();
      }
    } catch {
      setMessage(`Error updating ${field}`);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage('Database not configured');
      return;
    }

    setAuthLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      }
    } catch (error) {
      setMessage('An error occurred during sign in');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const editItem = (item: any, type: string) => {
    setEditingItem(item);
    switch (type) {
      case 'quote':
        setQuoteForm({ text: item.text, author: item.author });
        setShowQuoteForm(true);
        break;
      case 'event':
        setEventForm({
          title: item.title,
          slug: item.slug || '',
          description: item.description,
          start: item.start,
          end: item.end,
          location: item.location,
          calendar_link: item.calendar_link || '',
          image_url: item.image_url || ''
        });
        setShowEventForm(true);
        break;
      case 'resource':
        setResourceForm({
          title: item.title,
          description: item.description,
          category: item.category,
          url_or_storage_path: item.url_or_storage_path,
          tags: item.tags || [],
          image_url: item.image_url || ''
        });
        setShowResourceForm(true);
        break;
      case 'clubcouncil':
        setCouncilLeaderForm({
          name: item.name,
          role: item.role,
          bio: item.bio,
          year: item.year || '',
          email: item.email,
          linkedin_url: item.linkedin_url || '',
          photo_url: item.photo_url || ''
        });
        setShowCouncilLeaderForm(true);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-su-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? 'Sign in to access the admin dashboard' : 'Create an admin account'}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={isLogin ? handleSignIn : handleSignUp}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                  required
                />
              </div>
            )}

            {message && (
              <div className="p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-su-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-su-blue disabled:opacity-50"
            >
              {authLoading ? (isLogin ? 'Signing In...' : 'Signing Up...') : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-su-blue hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'No account? Create one' : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
      {/* Header */}
      <div className="bg-su-blue shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="bg-white text-su-blue px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

        {message && (
          <div className="mb-6 p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
            {message}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5 mr-2" /> },
              { id: 'quotes', label: 'Quotes', icon: <ChatIcon className="w-5 h-5 mr-2" /> },
              { id: 'events', label: 'Events', icon: <CalendarIcon className="w-5 h-5 mr-2" /> },
              { id: 'resources', label: 'Resources', icon: <BookIcon className="w-5 h-5 mr-2" /> },
              { id: 'councilleaders', label: 'Council Leaders', icon: <PeopleIcon className="w-5 h-5 mr-2" /> },
              { id: 'awareness', label: 'Monthly Awareness', icon: <SunIcon className="w-5 h-5 mr-2" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-black bg-blue-50'
                    : 'border-transparent text-black hover:text-black hover:border-gray-400 hover:bg-gray-50'
                } whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm transition-colors`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-su-blue">
                    <ChatIcon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalQuotes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <PeopleIcon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Council Leaders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCouncilLeaders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-su-blue">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <BookIcon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Resources</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Quotes</h2>
              <button
                onClick={() => {
                  setShowQuoteForm(true);
                  setEditingItem(null);
                  setQuoteForm({ text: '', author: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Quote
              </button>
            </div>

            {showQuoteForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? 'Edit Quote' : 'Add New Quote'}
                </h3>
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text</label>
                    <textarea
                      value={quoteForm.text}
                      onChange={(e) => setQuoteForm({ ...quoteForm, text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      value={quoteForm.author}
                      onChange={(e) => setQuoteForm({ ...quoteForm, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Quote' : 'Add Quote'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuoteForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editItem(quote, 'quote')}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteQuote(quote.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
              <button
                onClick={() => {
                  setShowEventForm(true);
                  setEditingItem(null);
                  setEventForm({ title: '', slug: '', description: '', start: '', end: '', location: '', calendar_link: '', image_url: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Event
              </button>
            </div>

            {showEventForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? 'Edit Event' : 'Add New Event'}
                </h3>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="datetime-local"
                        value={eventForm.start}
                        onChange={(e) => setEventForm({ ...eventForm, start: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                    <input
                      type="url"
                      value={eventForm.image_url}
                      onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Event' : 'Add Event'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEventForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(event as any).date ? new Date((event as any).date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editItem(event, 'event')}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Resources</h2>
              <button
                onClick={() => {
                  setShowResourceForm(true);
                  setEditingItem(null);
                  setResourceForm({ title: '', category: 'article', url_or_storage_path: '', tags: [], description: '', image_url: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Resource
              </button>
            </div>

            {showResourceForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                <form onSubmit={handleResourceSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={resourceForm.title}
                      onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={resourceForm.category}
                      onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Self-Care">Self-Care</option>
                      <option value="Stress Management">Stress Management</option>
                      <option value="Academic Support">Academic Support</option>
                      <option value="Crisis Resources">Crisis Resources</option>
                      <option value="Wellness">Wellness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={resourceForm.description}
                      onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">URL or Storage Path</label>
                    <input
                      type="text"
                      value={resourceForm.url_or_storage_path}
                      onChange={(e) => setResourceForm({ ...resourceForm, url_or_storage_path: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/article OR /files/guide.pdf"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Resource' : 'Add Resource'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResourceForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editItem(resource, 'resource')}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteResource(resource.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Council Leaders Tab */}
        {activeTab === 'councilleaders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Council Leaders</h2>
              <button
                onClick={() => {
                  setShowCouncilLeaderForm(true);
                  setEditingItem(null);
                  setCouncilLeaderForm({ name: '', role: '', bio: '', year: '', email: '', linkedin_url: '', photo_url: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Council Leader
              </button>
            </div>

            {showCouncilLeaderForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? 'Edit Council Leader' : 'Add New Council Leader'}
                </h3>
                <form onSubmit={handleClubCouncilSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={councilLeaderForm.name}
                      onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={councilLeaderForm.role}
                      onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={councilLeaderForm.bio}
                      onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={councilLeaderForm.year}
                      onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={councilLeaderForm.email}
                      onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL (optional)</label>
                    <input
                      type="url"
                      value={councilLeaderForm.linkedin_url}
                      onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, linkedin_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (optional)</label>
                    <input
                      type="url"
                      value={councilLeaderForm.photo_url}
                      onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, photo_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Council Leader' : 'Add Council Leader'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCouncilLeaderForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {councilLeaders.map((leader) => (
                    <tr key={leader.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leader.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leader.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leader.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editItem(leader, 'clubcouncil')}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteClubCouncilMember(leader.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Awareness Tab */}
        {activeTab === 'awareness' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Monthly Awareness</h2>
              <button
                onClick={() => {
                  setShowAwarenessForm(true);
                  setEditingAwarenessId(null);
                  setNewAwareness({
                    month: '',
                    theme: '',
                    message: '',
                    resource_url: '',
                    icon: 'sun',
                    banner_url: '',
                    caption: ''
                  });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Awareness Entry
              </button>
            </div>

            {showAwarenessForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingAwarenessId ? 'Edit Awareness Entry' : 'Add New Awareness Entry'}
                </h3>
                <form onSubmit={handleAwarenessSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                    <input
                      type="text"
                      value={newAwareness.month}
                      onChange={(e) => setNewAwareness({ ...newAwareness, month: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                    <input
                      type="text"
                      value={newAwareness.theme}
                      onChange={(e) => setNewAwareness({ ...newAwareness, theme: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={newAwareness.message}
                      onChange={(e) => setNewAwareness({ ...newAwareness, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource URL (optional)</label>
                    <input
                      type="url"
                      value={newAwareness.resource_url}
                      onChange={(e) => setNewAwareness({ ...newAwareness, resource_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select
                      value={newAwareness.icon}
                      onChange={(e) => setNewAwareness({ ...newAwareness, icon: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    >
                      <option value="sun">Sun</option>
                      <option value="heart">Heart</option>
                      <option value="star">Star</option>
                      <option value="leaf">Leaf</option>
                      <option value="moon">Moon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Banner URL (optional)</label>
                    <input
                      type="url"
                      value={newAwareness.banner_url}
                      onChange={(e) => setNewAwareness({ ...newAwareness, banner_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
                    <input
                      type="text"
                      value={newAwareness.caption}
                      onChange={(e) => setNewAwareness({ ...newAwareness, caption: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingAwarenessId ? 'Update Awareness Entry' : 'Add Awareness Entry'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAwarenessForm(false);
                        setEditingAwarenessId(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {awarenessEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.theme}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editAwareness(entry)}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAwareness(entry.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
      <div className="bg-su-blue shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="bg-white text-su-blue px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

        {message && (
          <div className="mb-6 p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
            {message}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5 mr-2" /> },
              { id: 'quotes', label: 'Quotes', icon: <ChatIcon className="w-5 h-5 mr-2" /> },
              { id: 'events', label: 'Events', icon: <CalendarIcon className="w-5 h-5 mr-2" /> },
              { id: 'resources', label: 'Resources', icon: <BookIcon className="w-5 h-5 mr-2" /> },
              { id: 'councilleaders', label: 'Council Leaders', icon: <PeopleIcon className="w-5 h-5 mr-2" /> },
              { id: 'awareness', label: 'Monthly Awareness', icon: <SunIcon className="w-5 h-5 mr-2" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-black bg-blue-50'
                    : 'border-transparent text-black hover:text-black hover:border-gray-400 hover:bg-gray-50'
                } whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm transition-colors`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-su-blue">
                    <ChatIcon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalQuotes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <PeopleIcon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Club Council Members</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCouncilLeaders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-su-blue">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <BookIcon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Resources</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Quotes</h2>
              <button
                onClick={() => {
                  setShowQuoteForm(true);
                  setEditingItem(null);
                  setQuoteForm({ text: '', author: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Quote
              </button>
            </div>

            {showQuoteForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? 'Edit Quote' : 'Add New Quote'}
                </h3>
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text</label>
                    <textarea
                      value={quoteForm.text}
                      onChange={(e) => setQuoteForm({ ...quoteForm, text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      value={quoteForm.author}
                      onChange={(e) => setQuoteForm({ ...quoteForm, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Quote' : 'Add Quote'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuoteForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editItem(quote, 'quote')}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteQuote(quote.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
              <button
                onClick={() => {
                  setShowEventForm(true);
                  setEditingItem(null);
                  setEventForm({ title: '', slug: '', description: '', start: '', end: '', location: '', calendar_link: '', image_url: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Event
              </button>
            </div>

            {showEventForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? 'Edit Event' : 'Add New Event'}
                </h3>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="datetime-local"
                        value={eventForm.start}
                        onChange={(e) => setEventForm({ ...eventForm, start: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                    <input
                      type="url"
                      value={eventForm.image_url}
                      onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Event' : 'Add Event'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEventForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(event as any).date ? new Date((event as any).date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editItem(event, 'event')}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Resources</h2>
              <button
                onClick={() => {
                  setShowResourceForm(true);
                  setEditingItem(null);
                  setResourceForm({ title: '', category: 'article', url_or_storage_path: '', tags: [], description: '', image_url: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Resource
              </button>
            </div>

            {showResourceForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                <form onSubmit={handleResourceSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={resourceForm.title}
                      onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={resourceForm.category}
                      onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Self-Care">Self-Care</option>
                      <option value="Stress Management">Stress Management</option>
                      <option value="Academic Support">Academic Support</option>
                      <option value="Crisis Resources">Crisis Resources</option>
                      <option value="Wellness">Wellness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={resourceForm.description}
                      onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">URL or Storage Path</label>
                    <input
                      type="text"
                      value={resourceForm.url_or_storage_path}
                      onChange={(e) => setResourceForm({ ...resourceForm, url_or_storage_path: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/article OR /files/guide.pdf"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Resource' : 'Add Resource'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResourceForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{resource.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editItem(resource, 'resource')}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteResource(resource.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* About Content Tab */}
        {activeTab === 'about' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage About Content</h2>
            
            {/* aboutContent state removed; nothing to render here */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Mission Text</h3>
                  <textarea
                    value={''}
                    onChange={(e) => handleAboutUpdate('mission_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    rows={4}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Story Text</h3>
                  <textarea
                    value={''}
                    onChange={(e) => handleAboutUpdate('story_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    rows={6}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Collaboration Note</h3>
                  <textarea
                    value={''}
                    onChange={(e) => handleAboutUpdate('collaboration_note', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {/* Club Council Tab */}
        {activeTab === 'clubcouncil' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Club Council Members</h2>
              <button
                onClick={() => {
                  setShowCouncilLeaderForm(true);
                  setEditingItem(null);
                  setCouncilLeaderForm({ name: '', role: '', bio: '', year: '', email: '', linkedin_url: '', photo_url: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Member
              </button>
            </div>
            {showCouncilLeaderForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? 'Edit Club Council Member' : 'Add New Club Council Member'}
                </h3>
                <form onSubmit={handleClubCouncilSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={councilLeaderForm.name}
                        onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        required
                        value={councilLeaderForm.role}
                        onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        placeholder="e.g., President, Vice President, Secretary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="text"
                        required
                        value={councilLeaderForm.year}
                        onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, year: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        placeholder="e.g., 4th Year Psychology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={councilLeaderForm.email}
                        onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      required
                      value={councilLeaderForm.bio}
                      onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      rows={4}
                      placeholder="Brief biography and background"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL (Optional)</label>
                      <input
                        type="url"
                        value={councilLeaderForm.linkedin_url}
                        onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, linkedin_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Optional)</label>
                      <input
                        type="url"
                        value={councilLeaderForm.photo_url}
                        onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, photo_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Member' : 'Add Member'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCouncilLeaderForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          </div>
        )}

{activeTab === 'councilleaders' && (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-black">Manage Council Leaders</h2>
      <button
        onClick={() => {
          setShowCouncilLeaderForm(true);
          setEditingItem(null);
          setCouncilLeaderForm({ name: '', role: '', bio: '', year: '', email: '', linkedin_url: '', photo_url: '' });
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add New Leader
      </button>
    </div>

    {showCouncilLeaderForm && (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">
          {editingItem ? 'Edit Council Leader' : 'Add New Council Leader'}
        </h3>
        <form onSubmit={handleClubCouncilSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Name</label>
              <input
                type="text"
                required
                value={councilLeaderForm.name}
                onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Role</label>
              <input
                type="text"
                required
                value={councilLeaderForm.role}
                onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., President, Vice President, Secretary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Year</label>
              <input
                type="text"
                required
                value={councilLeaderForm.year}
                onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 4th Year Psychology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Email</label>
              <input
                type="email"
                required
                value={councilLeaderForm.email}
                onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Bio</label>
            <textarea
              required
              value={councilLeaderForm.bio}
              onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Brief biography and background"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">LinkedIn URL (Optional)</label>
              <input
                type="url"
                value={councilLeaderForm.linkedin_url}
                onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, linkedin_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Photo URL (Optional)</label>
              <input
                type="url"
                value={councilLeaderForm.photo_url}
                onChange={(e) => setCouncilLeaderForm({ ...councilLeaderForm, photo_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              {editingItem ? 'Update Leader' : 'Add Leader'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCouncilLeaderForm(false);
                setEditingItem(null);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}

    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {councilLeaders.map((leader) => (
            <tr key={leader.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{leader.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{leader.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => editItem(leader, 'clubcouncil')} className="text-blue-600 hover:text-blue-900 mr-4">
                  Edit
                </button>
                <button onClick={() => deleteClubCouncilMember(leader.id)} className="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

        {/* Team Members Tab */}
        {activeTab === 'team' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Team Members</h2>
              <button
                onClick={() => {
                  setShowTeamMemberForm(true);
                  setEditingItem(null);
                  setTeamMemberForm({ name: '', role: '', bio: '', email: '', linkedin_url: '', photo_url: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Team Member
              </button>
            </div>

            {showTeamMemberForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? 'Edit Team Member' : 'Add New Team Member'}
                </h3>
                <form onSubmit={handleTeamMemberSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={teamMemberForm.name}
                        onChange={(e) => setTeamMemberForm({ ...teamMemberForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        required
                        value={teamMemberForm.role}
                        onChange={(e) => setTeamMemberForm({ ...teamMemberForm, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                        placeholder="e.g., President, Treasurer, Counselor"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={teamMemberForm.email}
                      onChange={(e) => setTeamMemberForm({ ...teamMemberForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      required
                      value={teamMemberForm.bio}
                      onChange={(e) => setTeamMemberForm({ ...teamMemberForm, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                      rows={4}
                      placeholder="Brief biography"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL (Optional)</label>
                      <input
                        type="url"
                        value={teamMemberForm.linkedin_url}
                        onChange={(e) => setTeamMemberForm({ ...teamMemberForm, linkedin_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Optional)</label>
                      <input
                        type="url"
                        value={teamMemberForm.photo_url}
                        onChange={(e) => setTeamMemberForm({ ...teamMemberForm, photo_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Member' : 'Add Member'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
setShowCouncilLeaderForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {councilLeaders.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {member.photo_url && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image
                                className="h-10 w-10 rounded-full object-cover"
                                src={member.photo_url}
                                alt={member.name}
                                width={40}
                                height={40}
                              />
                            </div>
                          )}
                          <div className={member.photo_url ? "ml-4" : ""}>
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{member.bio}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editItem(member, 'team')}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTeamMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Awareness Tab */}
        {activeTab === 'awareness' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Monthly Awareness</h2>

            {/* Add New Entry */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-su-blue mb-4">Add Awareness Entry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newAwareness.month}
                  onChange={(e) => setNewAwareness({ ...newAwareness, month: e.target.value })}
                  placeholder="Month e.g., January"
                  className="border rounded-md px-3 py-2"
                  aria-label="Month"
                />
                <input
                  type="text"
                  value={newAwareness.theme}
                  onChange={(e) => setNewAwareness({ ...newAwareness, theme: e.target.value })}
                  placeholder="Theme e.g., Stress Awareness"
                  className="border rounded-md px-3 py-2"
                  aria-label="Theme"
                />
                <input
                  type="text"
                  value={newAwareness.message}
                  onChange={(e) => setNewAwareness({ ...newAwareness, message: e.target.value })}
                  placeholder="Supportive message"
                  className="border rounded-md px-3 py-2 md:col-span-2"
                  aria-label="Message"
                />
                <input
                  type="url"
                  value={newAwareness.resource_url ?? ''}
                  onChange={(e) => setNewAwareness({ ...newAwareness, resource_url: e.target.value })}
                  placeholder="Resource URL (optional)"
                  className="border rounded-md px-3 py-2 md:col-span-2"
                  aria-label="Resource URL"
                />
                <select
                  value={newAwareness.icon}
                  onChange={(e) => setNewAwareness({ ...newAwareness, icon: e.target.value as 'sun' })}
                  className="border rounded-md px-3 py-2"
                  aria-label="Icon"
                >
                  <option value="sun">Sun</option>
                  <option value="heart">Heart</option>
                  <option value="lightbulb">Lightbulb</option>
                  <option value="balance">Balance</option>
                  <option value="chat">Chat</option>
                  <option value="people">People</option>
                </select>
              </div>
              <button
                  className="mt-4 bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={async () => {
                    if (!supabase) return;
                    const payload = {
                      month: newAwareness.month,
                      theme: newAwareness.theme,
                      message: newAwareness.message,
                      resource_url: newAwareness.resource_url || null,
                      icon: newAwareness.icon,
                      banner_url: newAwareness.banner_url || null,
                      caption: newAwareness.caption || null,
                    };
                    const { error } = await supabase.from('monthly_awareness').insert([payload]);
                    if (!error) {
                      setMessage('Awareness entry added successfully!');
                      setNewAwareness({ month: '', theme: '', message: '', resource_url: '', icon: 'sun', banner_url: '', caption: '' });
                      setShowAwarenessForm(false);
                      fetchMonthlyAwareness();
                      fetchStats();
                    } else {
                      setMessage('Error adding awareness entry');
                    }
                  }}
                  aria-label="Add Awareness Entry"
                >
                Add Entry
              </button>
            </div>

            {/* Awareness List */}
            <div className="space-y-4">
              {awarenessEntries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
                  {editingAwarenessId === entry.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        defaultValue={entry.month}
                        onChange={(e) => (entry.month = e.target.value)}
                        className="border rounded-md px-3 py-2"
                        aria-label="Edit Month"
                      />
                      <input
                        type="text"
                        defaultValue={entry.theme}
                        onChange={(e) => (entry.theme = e.target.value)}
                        className="border rounded-md px-3 py-2"
                        aria-label="Edit Theme"
                      />
                      <input
                        type="text"
                        defaultValue={entry.message}
                        onChange={(e) => (entry.message = e.target.value)}
                        className="border rounded-md px-3 py-2 md:col-span-2"
                        aria-label="Edit Message"
                      />
                      <input
                        type="url"
                        defaultValue={entry.resource_url ?? ''}
                        onChange={(e) => (entry.resource_url = e.target.value)}
                        className="border rounded-md px-3 py-2 md:col-span-2"
                        aria-label="Edit Resource URL"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                            className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            onClick={async () => {
                              if (!supabase) return;

                              const { error } = await supabase
                                .from('monthly_awareness')
                                .update({
                                  month: entry.month,
                                  theme: entry.theme,
                                  message: entry.message,
                                  resource_url: entry.resource_url || null,
                                  icon: entry.icon || 'sun',
                                })
                                .eq('id', entry.id);

                              if (!error) {
                                setAwarenessEntries((prev) => prev.map((a) => (a.id === entry.id ? entry : a)));
                                setEditingAwarenessId(null);
                                setMessage('Awareness entry updated successfully');
                              } else {
                                setMessage(error.message || 'Failed to update awareness entry');
                              }
                            }}
                          >
                          Save
                        </button>
                        <button
                          className="bg-gray-100 text-su-black px-4 py-2 rounded-md hover:bg-gray-200"
                          onClick={() => setEditingAwarenessId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="md:flex md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-su-black/70">{entry.month}</p>
                        <h3 className="text-lg font-semibold text-su-blue">{entry.theme}</h3>
                        <p className="text-gray-700 mt-2">{entry.message}</p>
                        {entry.resource_url && (
                          <a
                            href={entry.resource_url}
                            className="inline-block mt-2 text-sm font-medium text-su-blue hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Learn More
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <button
                          className="bg-white text-su-blue border border-su-blue px-4 py-2 rounded-md hover:bg-blue-50"
                          onClick={() => setEditingAwarenessId(entry.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-su-red text-white px-4 py-2 rounded-md hover:bg-red-600"
                          onClick={async () => {
                            if (!supabase) return;

                            const { error } = await supabase
                              .from('monthly_awareness')
                              .delete()
                              .eq('id', entry.id);

                            if (!error) {
                              setAwarenessEntries((prev) => prev.filter((a) => a.id !== entry.id));
                              setMessage('Awareness entry deleted successfully');
                            } else {
                              setMessage(error.message || 'Failed to delete awareness entry');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Contact Tab */}
        {activeTab === 'footer' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Footer Contact Information</h2>
            
            {footerContent && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Email</h3>
                  <input
                    type="email"
                    value={(footerContent as any)?.email || ''}
                    onChange={(e) => handleFooterUpdate('club_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Phone Number</h3>
                  <input
                    type="tel"
                    value={(footerContent as any)?.phone || ''}
                    onChange={(e) => handleFooterUpdate('med_centre_contact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  <textarea
                    value={(footerContent as any)?.address || ''}
                    onChange={(e) => handleFooterUpdate('med_centre_contact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    rows={3}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
                  <input
                    type="text"
                    value={(footerContent as any)?.office_hours || ''}
                    onChange={(e) => handleFooterUpdate('emergency_numbers', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    placeholder="e.g., Monday - Friday: 9:00 AM - 5:00 PM"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
