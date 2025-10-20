'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import type { Event, Resource, Quote, AboutContent, Footer, ClubCouncilMember } from '../../types/database.types';
import { 
  HomeIcon, 
  ChatIcon, 
  CalendarIcon, 
  BookIcon, 
  PeopleIcon, 
  UserIcon, 
  ChartIcon,
  DocumentIcon,
  EmailIcon,
  SunIcon
} from '../../components/icons';

interface AdminStats {
  totalEvents: number;
  totalResources: number;
  totalUsers: number;
  totalQuotes: number;
  totalClubCouncil: number;
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
    totalUsers: 0,
    totalQuotes: 0,
    totalClubCouncil: 0
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Monthly Awareness states
  const [awarenessEntries, setAwarenessEntries] = useState<any[]>([]);
  const [editingAwarenessId, setEditingAwarenessId] = useState<string | null>(null);
  const [newAwareness, setNewAwareness] = useState<{
    id: string;
    month: string;
    theme: string;
    message: string;
    resource_url: string;
    icon: string;
  }>({
    id: '',
    month: '', 
    theme: '', 
    message: '', 
    resource_url: '',
    icon: 'sun'
  });

  // Data arrays
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [clubCouncil, setClubCouncil] = useState<ClubCouncilMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [footerContent, setFooterContent] = useState<Footer | null>(null);

  // Form visibility states
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showClubCouncilForm, setShowClubCouncilForm] = useState(false);
  const [showTeamMemberForm, setShowTeamMemberForm] = useState(false);

  // Form data states
  const [quoteForm, setQuoteForm] = useState({ text: '', author: '' });
  const [eventForm, setEventForm] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    location: '', 
    image_url: '' 
  });
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    category: '',
    content: ''
  });
  const [clubCouncilForm, setClubCouncilForm] = useState({
    name: '',
    role: '',
    bio: '',
    year: '',
    email: '',
    linkedin_url: '',
    photo_url: ''
  });
  const [teamMemberForm, setTeamMemberForm] = useState({
    name: '',
    role: '',
    bio: '',
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

    return () => subscription.unsubscribe();
  }, []);

  // Fetch functions
  const fetchQuotes = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
    if (!error) setQuotes(data || []);
  };

  const fetchEvents = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (!error) setEvents(data || []);
  };

  const fetchResources = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    if (!error) setResources(data || []);
  };

  const fetchClubCouncil = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('club_council').select('*').order('created_at', { ascending: false });
    if (!error) setClubCouncil(data || []);
  };

  const fetchAboutContent = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('about').select('*').single();
    if (!error) setAboutContent(data);
  };

  const fetchFooterContent = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('footer').select('*').single();
    if (!error) setFooterContent(data);
  };

  const fetchTeamMembers = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: false });
    if (!error) setTeamMembers(data || []);
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
          .from('club_council')
          .update(clubCouncilForm)
          .eq('id', editingItem.id);
        if (!error) {
          setMessage('Club Council member updated successfully!');
          setEditingItem(null);
        }
      } else {
        const { data, error } = await supabase.from('club_council').insert([clubCouncilForm]).select();
        if (!error && data) {
          setClubCouncil([data[0], ...clubCouncil]);
          setMessage('Club Council member added successfully!');
        }
      }

      setClubCouncilForm({ name: '', role: '', bio: '', year: '', email: '', linkedin_url: '', photo_url: '' });
      setShowClubCouncilForm(false);
      fetchClubCouncil();
      fetchStats();
    } catch (error) {
      setMessage('Error saving club council member');
    }
  };

  const deleteClubCouncilMember = async (id: string) => {
    if (!supabase) return;
    if (confirm('Are you sure you want to delete this club council member?')) {
      const { error } = await supabase.from('club_council').delete().eq('id', id);
      if (!error) {
        setMessage('Club Council member deleted successfully!');
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
          .update(teamMemberForm)
          .eq('id', editingItem.id);
        if (!error) {
          setMessage('Team member updated successfully!');
          setEditingItem(null);
          await fetchTeamMembers();
        }
      } else {
        const { data, error } = await supabase.from('team_members').insert([teamMemberForm]).select();
        if (!error && data) {
          setTeamMembers([data[0], ...teamMembers]);
          setMessage('Team member added successfully!');
        }
      }

      setTeamMemberForm({ name: '', role: '', bio: '', email: '', linkedin_url: '', photo_url: '' });
      setShowTeamMemberForm(false);
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
  useEffect(() => {
    if (user) {
      fetchStats();
      fetchQuotes();
      fetchEvents();
      fetchResources();
      fetchClubCouncil();
      fetchTeamMembers();
      fetchAboutContent();
      fetchFooterContent();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!supabase) return;
    try {
      const [eventsRes, resourcesRes, quotesRes, clubCouncilRes] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('resources').select('id', { count: 'exact' }),
        supabase.from('quotes').select('id', { count: 'exact' }),
        supabase.from('club_council').select('id', { count: 'exact' })
      ]);

      setStats({
        totalEvents: eventsRes.count || 0,
        totalResources: resourcesRes.count || 0,
        totalUsers: 0,
        totalQuotes: quotesRes.count || 0,
        totalClubCouncil: clubCouncilRes.count || 0
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

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('events')
          .update(eventForm)
          .eq('id', editingItem.id);
        if (!error) {
          setMessage('Event updated successfully!');
          setEditingItem(null);
          // Fetch updated events to refresh the UI
          await fetchEvents();
          await fetchStats();
        }
      } else {
        const { data, error } = await supabase.from('events').insert([eventForm]).select();
        if (!error && data) {
          // Update local state with the new event
          setEvents([data[0], ...events]);
          setMessage('Event added successfully!');
          // Refresh stats
          await fetchStats();
        }
      }

      setEventForm({ title: '', description: '', date: '', location: '', image_url: '' });
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
      if (editingItem) {
        const { error } = await supabase
          .from('resources')
          .update(resourceForm)
          .eq('id', editingItem.id);
        if (!error) {
          setMessage('Resource updated successfully!');
          setEditingItem(null);
          // Fetch updated resources to refresh the UI
          await fetchResources();
          await fetchStats();
        }
      } else {
        const { data, error } = await supabase.from('resources').insert([resourceForm]).select();
        if (!error && data) {
          // Update local state with the new resource
          setResources([data[0], ...resources]);
          setMessage('Resource added successfully!');
          // Refresh stats
          await fetchStats();
        }
      }

      setResourceForm({ title: '', description: '', category: '', content: '' });
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
  const handleAboutUpdate = async (field: string, value: any) => {
    if (!supabase) return;
    try {
      const updateData = { [field]: value };
      const { error } = await supabase
        .from('about_content')
        .upsert(updateData)
        .eq('id', aboutContent?.id || 1);

      if (!error) {
        setMessage(`${field} updated successfully!`);
        fetchAboutContent();
      }
    } catch (error) {
      setMessage(`Error updating ${field}`);
    }
  };

  // Footer Contact Update
  const handleFooterUpdate = async (field: string, value: string) => {
    if (!supabase) return;
    try {
      const updateData = { [field]: value };
      const { error } = await supabase
        .from('footer_contact')
        .upsert(updateData)
        .eq('id', footerContent?.id || 1);

      if (!error) {
        setMessage(`${field} updated successfully!`);
        fetchFooterContent();
      }
    } catch (error) {
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
          description: item.description,
          date: item.date,
          location: item.location,
          image_url: item.image_url || ''
        });
        setShowEventForm(true);
        break;
      case 'resource':
        setResourceForm({
          title: item.title,
          description: item.description,
          category: item.category,
          content: item.content
        });
        setShowResourceForm(true);
        break;
      case 'clubcouncil':
        setClubCouncilForm({
          name: item.name,
          role: item.role,
          bio: item.bio,
          year: item.year,
          email: item.email,
          linkedin_url: item.linkedin_url || '',
          photo_url: item.photo_url || ''
        });
        setShowClubCouncilForm(true);
        break;
      case 'team':
        setTeamMemberForm({
          name: item.name,
          role: item.role,
          bio: item.bio,
          email: item.email,
          linkedin_url: item.linkedin_url || '',
          photo_url: item.photo_url || ''
        });
        setShowTeamMemberForm(true);
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
              Sign in to access the admin dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
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
              {authLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
    { id: 'clubcouncil', label: 'Club Council', icon: <PeopleIcon className="w-5 h-5 mr-2" /> },
    { id: 'team', label: 'Team Members', icon: <UserIcon className="w-5 h-5 mr-2" /> },
    { id: 'about', label: 'About Content', icon: <DocumentIcon className="w-5 h-5 mr-2" /> },
    { id: 'footer', label: 'Footer Contact', icon: <EmailIcon className="w-5 h-5 mr-2" /> },
    { id: 'awareness', label: 'Monthly Awareness', icon: <SunIcon className="w-5 h-5 mr-2" /> },
    { id: 'awareness', label: 'Monthly Awareness', icon: <SunIcon className="w-5 h-5 mr-2" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center ${
                  activeTab === tab.id
                    ? 'border-su-blue text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
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
                    <p className="text-2xl font-bold text-gray-900">{stats.totalClubCouncil}</p>
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
                  setEventForm({ title: '', description: '', date: '', location: '', image_url: '' });
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
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
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
                  setResourceForm({ title: '', description: '', category: '', content: '' });
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
                      onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={resourceForm.content}
                      onChange={(e) => setResourceForm({ ...resourceForm, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      rows={6}
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
            
            {aboutContent && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Mission Statement</h3>
                  <textarea
                    value={(aboutContent as any).mission || ''}
                    onChange={(e) => handleAboutUpdate('mission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    rows={4}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Vision Statement</h3>
                  <textarea
                    value={(aboutContent as any).vision || ''}
                    onChange={(e) => handleAboutUpdate('vision', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    rows={4}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">History</h3>
                  <textarea
                    value={(aboutContent as any).history || ''}
                    onChange={(e) => handleAboutUpdate('history', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    rows={6}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Values (one per line)</h3>
                  <textarea
                    value={Array.isArray((aboutContent as any)?.values) ? (aboutContent as any).values.join('\n') : ''}
                    onChange={(e) => handleAboutUpdate('values', e.target.value.split('\n').filter(v => v.trim()))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    rows={6}
                    placeholder="Enter each value on a new line"
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
                  setShowClubCouncilForm(true);
                  setEditingItem(null);
                  setClubCouncilForm({ name: '', role: '', bio: '', year: '', email: '', linkedin_url: '', photo_url: '' });
                }}
                className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Member
              </button>
            </div>

            {showClubCouncilForm && (
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
                        value={clubCouncilForm.name}
                        onChange={(e) => setClubCouncilForm({ ...clubCouncilForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        required
                        value={clubCouncilForm.role}
                        onChange={(e) => setClubCouncilForm({ ...clubCouncilForm, role: e.target.value })}
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
                        value={clubCouncilForm.year}
                        onChange={(e) => setClubCouncilForm({ ...clubCouncilForm, year: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        placeholder="e.g., 4th Year Psychology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={clubCouncilForm.email}
                        onChange={(e) => setClubCouncilForm({ ...clubCouncilForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      required
                      value={clubCouncilForm.bio}
                      onChange={(e) => setClubCouncilForm({ ...clubCouncilForm, bio: e.target.value })}
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
                        value={clubCouncilForm.linkedin_url}
                        onChange={(e) => setClubCouncilForm({ ...clubCouncilForm, linkedin_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Optional)</label>
                      <input
                        type="url"
                        value={clubCouncilForm.photo_url}
                        onChange={(e) => setClubCouncilForm({ ...clubCouncilForm, photo_url: e.target.value })}
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
                        setShowClubCouncilForm(false);
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
                      Leader
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
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
                  {clubCouncil.map((member) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editItem(member, 'clubcouncil')}
                          className="text-su-blue hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteClubCouncilMember(member.id)}
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
                        setShowTeamMemberForm(false);
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
                  {teamMembers.map((member) => (
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
                  onChange={(e) => setNewAwareness({ ...newAwareness, icon: e.target.value as MonthlyAwareness['icon'] })}
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
                onClick={() => {
                  if (!newAwareness.month || !newAwareness.theme || !newAwareness.message) return;
                  const id = `${newAwareness.month.toLowerCase()}-${Date.now()}`;
                  setAwarenessEntries((prev) => [...prev, { ...newAwareness, id }]);
                  setNewAwareness({ id: '', month: '', theme: '', message: '', resource_url: '', icon: 'sun' });
                  // TODO: Supabase insert goes here
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
                          onClick={() => {
                            setAwarenessEntries((prev) => prev.map((a) => (a.id === entry.id ? entry : a)));
                            setEditingAwarenessId(null);
                            // TODO: Supabase update goes here
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
                          onClick={() => {
                            setAwarenessEntries((prev) => prev.filter((a) => a.id !== entry.id));
                            // TODO: Supabase delete goes here
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
                    onChange={(e) => handleFooterUpdate('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Phone Number</h3>
                  <input
                    type="tel"
                    value={(footerContent as any)?.phone || ''}
                    onChange={(e) => handleFooterUpdate('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  <textarea
                    value={(footerContent as any)?.address || ''}
                    onChange={(e) => handleFooterUpdate('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue"
                    rows={3}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
                  <input
                    type="text"
                    value={(footerContent as any)?.office_hours || ''}
                    onChange={(e) => handleFooterUpdate('office_hours', e.target.value)}
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
