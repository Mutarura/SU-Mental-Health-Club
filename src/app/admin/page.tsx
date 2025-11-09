'use client';

import { useState, useEffect } from 'react';
import { supabase, uploadImageToStorage } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Event, Resource, Quote, CouncilLeader, GalleryEvent, GalleryImage } from '../../types/database.types';
import { 
  HomeIcon, 
  ChatIcon, 
  CalendarIcon, 
  BookIcon, 
  PeopleIcon, 
  UserIcon,
  DocumentIcon,
  SunIcon
} from '../../components/icons';
import { MONTHLY_AWARENESS as DEFAULT_AWARENESS } from '../../data/monthlyAwareness';

interface AdminStats {
  totalEvents: number;
  totalResources: number;
  totalQuotes: number;
  totalCouncilLeaders: number;
  totalAwareness: number;
  totalGalleryEvents: number;
}

type AdminTab = 'dashboard' | 'gallery' | 'events' | 'resources' | 'council' | 'awareness' | 'quotes';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Quotes states
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [quoteForm, setQuoteForm] = useState({ author: '', text: '' });

  // Helper: check admin email via `admins` table to align with RLS
  const checkIsAdmin = async (email: string | null | undefined): Promise<boolean> => {
    if (!email || !supabase) return false;
    const { data, error } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .limit(1);
    if (error) {
      console.error('Admin check failed:', error);
      return false;
    }
    return !!data && data.length > 0;
  };

  const [stats, setStats] = useState<AdminStats>({
    totalEvents: 0,
    totalResources: 0,
    totalAwareness: 0,
    totalQuotes: 0,
    totalCouncilLeaders: 0,
    totalGalleryEvents: 0,
  });

  // Gallery states
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState({ title: '', short_description: '', cover_image: '' });
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [uploadGalleryImageError, setUploadGalleryImageError] = useState<string | null>(null);
  const [showGalleryImageUpload, setShowGalleryImageUpload] = useState<string | null>(null);
  const [galleryImageForm, setGalleryImageForm] = useState({ caption: '' });

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryVideoFile, setGalleryVideoFile] = useState<File | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [galleryVideoPreview, setGalleryVideoPreview] = useState<string>('');
  const [galleryUploadError, setGalleryUploadError] = useState<string>('');

  // Event states
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
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
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [uploadingEventImage, setUploadingEventImage] = useState(false);
  const [uploadEventImageError, setUploadEventImageError] = useState<string | null>(null);

  // Resource states
  const [resources, setResources] = useState<Resource[]>([]);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    category: 'article' as 'article' | 'wellness_tools' | 'podcast',
    url_or_storage_path: '',
    tags: [] as string[],
    description: '',
    image_url: ''
  });
  const [resourceImageFile, setResourceImageFile] = useState<File | null>(null);
  const [uploadingResourceImage, setUploadingResourceImage] = useState(false);
  const [uploadResourceImageError, setUploadResourceImageError] = useState<string | null>(null);

  // Council states
  const [councilLeaders, setCouncilLeaders] = useState<CouncilLeader[]>([]);
  const [showCouncilForm, setShowCouncilForm] = useState(false);
  const [editingCouncilId, setEditingCouncilId] = useState<string | null>(null);
  const [councilForm, setCouncilForm] = useState({
    name: '',
    role: '',
    year: '',
    linkedin_url: '',
    photo_url: ''
  });
  const [councilImageFile, setCouncilImageFile] = useState<File | null>(null);
  const [uploadingCouncilImage, setUploadingCouncilImage] = useState(false);
  const [uploadCouncilImageError, setUploadCouncilImageError] = useState<string | null>(null);

  // Awareness states
  const [awarenessEntries, setAwarenessEntries] = useState<any[]>([]);
  const [showAwarenessForm, setShowAwarenessForm] = useState(false);
  const [editingAwarenessId, setEditingAwarenessId] = useState<string | null>(null);
  const [awarenessForm, setAwarenessForm] = useState({
    month: '',
    theme: '',
    message: '',
    resource_url: '',
    icon: 'sun' as const,
    banner_url: '',
    caption: ''
  });
  const [awarenessImageFile, setAwarenessImageFile] = useState<File | null>(null);
  const [uploadingAwarenessImage, setUploadingAwarenessImage] = useState(false);

  // Auth and initialization
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Initial user fetch with admins table check
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user || null);
      const admin = await checkIsAdmin(user?.email ?? null);
      setIsAdmin(admin);
      setLoading(false);
    });

    // Auth state changes with admins table check
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      checkIsAdmin(u?.email ?? null).then((admin) => {
        setIsAdmin(admin);
        setLoading(false);
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Message auto-clear
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    fetchStats();
    fetchGalleryData();
    fetchEvents();
    fetchResources();
    fetchCouncilLeaders();
    fetchAwareness();
    fetchQuotes();

    const channels = [
      supabase?.channel('gallery-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_events' }, fetchGalleryData),
      supabase?.channel('events-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents),
      supabase?.channel('resources-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, fetchResources),
      supabase?.channel('council-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'council_leaders' }, fetchCouncilLeaders),
      supabase?.channel('awareness-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'monthly_awareness' }, fetchAwareness),
      supabase?.channel('quotes-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, () => { fetchQuotes(); fetchStats(); }), // add
    ];

    channels.forEach(ch => ch?.subscribe());

    return () => {
      channels.forEach(ch => ch?.unsubscribe());
    };
  }, [user]);

  // Fetch functions
  const fetchStats = async () => {
    if (!supabase) return;
    try {
      const [eventsCount, resourcesCount, awarenessCount, galleryCount, quotesCount, councilCount] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('resources').select('id', { count: 'exact' }),
        supabase.from('monthly_awareness').select('id', { count: 'exact' }),
        supabase.from('gallery_events').select('id', { count: 'exact' }),
        supabase.from('quotes').select('id', { count: 'exact' }),
        supabase.from('council_leaders').select('id', { count: 'exact' }),
      ]);

      setStats({
        totalEvents: eventsCount.count || 0,
        totalResources: resourcesCount.count || 0,
        totalAwareness: awarenessCount.count || 0,
        totalQuotes: quotesCount.count || 0,
        totalCouncilLeaders: councilCount.count || 0,
        totalGalleryEvents: galleryCount.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchGalleryData = async () => {
    if (!supabase) return;
    try {
      const { data: events } = await supabase.from('gallery_events').select('*').order('created_at', { ascending: false });
      const { data: images } = await supabase.from('gallery_images').select('*').order('display_order', { ascending: true });
      if (events) setGalleryEvents(events);
      if (images) setGalleryImages(images);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const fetchEvents = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('events').select('*').order('start', { ascending: true });
    if (data) setEvents(data);
  };

  const fetchResources = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    if (data) setResources(data);
  };

  const fetchCouncilLeaders = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('council_leaders').select('*').order('created_at', { ascending: false });
    if (data) setCouncilLeaders(data);
  };

  const fetchAwareness = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('monthly_awareness').select('*').order('created_at', { ascending: true });
    if (data) setAwarenessEntries(data || DEFAULT_AWARENESS);
  };

  const fetchQuotes = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setQuotes(data);
  };

  // GALLERY CRUD
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setUploadingGalleryImage(true);
    let coverUrl = galleryForm.cover_image;

    if (galleryImageFile) {
      try {
        const publicUrl = await uploadImageToStorage(galleryImageFile, 'gallery');
        coverUrl = publicUrl ?? '';
      } catch (error: any) {
        setUploadGalleryImageError(error.message);
        setUploadingGalleryImage(false);
        return;
      }
    }

    try {
      const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        title: galleryForm.title,
        slug: slugify(galleryForm.title),
        short_description: galleryForm.short_description,
        cover_image: coverUrl || null,
      };

      if (editingGalleryId) {
        await supabase.from('gallery_events').update(payload).eq('id', editingGalleryId);
        setMessage('Gallery event updated successfully!');
      } else {
        await supabase.from('gallery_events').insert([payload]);
        setMessage('Gallery event added successfully!');
      }

      setShowGalleryForm(false);
      setEditingGalleryId(null);
      setGalleryForm({ title: '', short_description: '', cover_image: '' });
      setGalleryImageFile(null);
      fetchGalleryData();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  const deleteGalleryEvent = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this gallery event and all images?')) return;
    try {
      await supabase.from('gallery_images').delete().eq('gallery_event_id', id);
      await supabase.from('gallery_events').delete().eq('id', id);
      setMessage('Gallery event deleted successfully!');
      fetchGalleryData();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleAddGalleryImage = async (e: React.FormEvent, galleryEventId: string) => {
    e.preventDefault();
    if (!supabase || (galleryFiles.length === 0 && !galleryVideoFile)) return;

    try {
      setUploadingGalleryImage(true);
      let currentDisplayOrder = galleryImages.filter(img => img.gallery_event_id === galleryEventId).length;

      // Upload multiple images
      if (galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i];
          const publicUrl = await uploadImageToStorage(file, 'gallery/images');
          if (!publicUrl) {
            throw new Error(`Storage upload failed for image ${i + 1}. Check browser console for details.`);
          }

          const { error: dbError } = await supabase.from('gallery_images').insert([{
            gallery_event_id: galleryEventId,
            image_url: publicUrl,
            caption: galleryImageForm.caption || null,
            display_order: currentDisplayOrder + i + 1,
            media_type: 'image',
          }]);

          if (dbError) {
            throw new Error(`Database insert failed for image ${i + 1}: ${dbError.message}`);
          }
        }
        currentDisplayOrder += galleryFiles.length;
      }

      // Upload video if present
      if (galleryVideoFile) {
        const publicUrl = await uploadImageToStorage(galleryVideoFile, 'gallery/videos');
        if (!publicUrl) {
          throw new Error('Storage upload failed for video. Check browser console for details.');
        }

        const { error: dbError } = await supabase.from('gallery_images').insert([{
          gallery_event_id: galleryEventId,
          image_url: publicUrl,
          caption: galleryImageForm.caption || null,
          display_order: currentDisplayOrder + 1,
          media_type: 'video',
        }]);

        if (dbError) {
          throw new Error(`Database insert failed for video: ${dbError.message}`);
        }
      }

      setMessage('Gallery media added successfully!');
      setShowGalleryImageUpload(null);
      setGalleryImageForm({ caption: '' });
      clearGalleryFiles();
      fetchGalleryData();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this image?')) return;
    try {
      await supabase.from('gallery_images').delete().eq('id', id);
      setMessage('Image deleted successfully!');
      fetchGalleryData();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Gallery file validation and handling
  const MAX_IMAGE_FILES = 5;
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB in bytes

  const validateGalleryFiles = (files: FileList): { images: File[], video: File | null, error: string } => {
    const images: File[] = [];
    let video: File | null = null;
    let error = '';

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        images.push(file);
      } else if (file.type.startsWith('video/')) {
        if (video) {
          error = 'Only one video file is allowed per event.';
        } else if (file.size > MAX_VIDEO_SIZE) {
          error = `Video file must be smaller than 20MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
        } else {
          video = file;
        }
      }
    });

    if (images.length > MAX_IMAGE_FILES) {
      error = `Maximum ${MAX_IMAGE_FILES} images allowed. You selected ${images.length} images.`;
    }

    return { images, video, error };
  };

  const handleGalleryFilesChange = (files: FileList | null) => {
    if (!files) return;
    
    const { images, video, error } = validateGalleryFiles(files);
    
    if (error) {
      setGalleryUploadError(error);
      return;
    }
    
    setGalleryUploadError('');
    setGalleryFiles(images);
    setGalleryVideoFile(video);
    
    // Create previews
    const imagePreviews: string[] = [];
    images.forEach(image => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          imagePreviews.push(e.target.result as string);
          if (imagePreviews.length === images.length) {
            setGalleryImagePreviews(imagePreviews);
          }
        }
      };
      reader.readAsDataURL(image);
    });
    
    // Create video preview
    if (video) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setGalleryVideoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(video);
    }
  };

  const clearGalleryFiles = () => {
    setGalleryFiles([]);
    setGalleryVideoFile(null);
    setGalleryImagePreviews([]);
    setGalleryVideoPreview('');
    setGalleryUploadError('');
  };

  // EVENT CRUD
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setUploadingEventImage(true);
    let imageUrl = eventForm.image_url;

    if (eventImageFile) {
      try {
        const publicUrl = await uploadImageToStorage(eventImageFile, 'events');
        imageUrl = publicUrl ?? '';
      } catch (error: any) {
        setUploadEventImageError(error.message);
        setUploadingEventImage(false);
        return;
      }
    }

    try {
      const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        title: eventForm.title,
        slug: slugify(eventForm.title),
        description: eventForm.description,
        location: eventForm.location,
        image_url: imageUrl || null,
        start: new Date(eventForm.start).toISOString(),
        end: new Date(eventForm.end).toISOString(),
        calendar_link: eventForm.calendar_link || null
      };

      if (editingEventId) {
        await supabase.from('events').update(payload).eq('id', editingEventId);
        setMessage('Event updated successfully!');
      } else {
        await supabase.from('events').insert([payload]);
        setMessage('Event added successfully!');
      }

      setShowEventForm(false);
      setEditingEventId(null);
      setEventForm({ title: '', slug: '', description: '', start: '', end: '', location: '', calendar_link: '', image_url: '' });
      setEventImageFile(null);
      fetchEvents();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploadingEventImage(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this event?')) return;
    try {
      await supabase.from('events').delete().eq('id', id);
      setMessage('Event deleted successfully!');
      fetchEvents();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const editEvent = (event: Event) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title,
      slug: event.slug,
      description: event.description,
      start: event.start.substring(0, 16),
      end: event.end.substring(0, 16),
      location: event.location,
      calendar_link: event.calendar_link || '',
      image_url: event.image_url || '',
    });
    setShowEventForm(true);
  };

  // RESOURCE CRUD
  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setUploadingResourceImage(true);
    let imageUrl = resourceForm.image_url;

    if (resourceImageFile) {
      try {
        const publicUrl = await uploadImageToStorage(resourceImageFile, 'resources');
        imageUrl = publicUrl ?? '';
      } catch (error: any) {
        setUploadResourceImageError(error.message);
        setUploadingResourceImage(false);
        return;
      }
    }

    try {
      const payload = {
        title: resourceForm.title,
        category: resourceForm.category,
        description: resourceForm.description,
        url_or_storage_path: resourceForm.url_or_storage_path,
        image_url: imageUrl || null,
        tags: resourceForm.tags,
      };

      if (editingResourceId) {
        await supabase.from('resources').update(payload).eq('id', editingResourceId);
        setMessage('Resource updated successfully!');
      } else {
        await supabase.from('resources').insert([payload]);
        setMessage('Resource added successfully!');
      }

      setShowResourceForm(false);
      setEditingResourceId(null);
      setResourceForm({ title: '', category: 'article', url_or_storage_path: '', tags: [], description: '', image_url: '' });
      setResourceImageFile(null);
      fetchResources();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploadingResourceImage(false);
    }
  };

  const deleteResource = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this resource?')) return;
    try {
      await supabase.from('resources').delete().eq('id', id);
      setMessage('Resource deleted successfully!');
      fetchResources();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const editResource = (resource: Resource) => {
    setEditingResourceId(resource.id);
    setResourceForm({
      title: resource.title,
      category: (resource.category as 'article' | 'wellness_tools' | 'podcast') || 'article',
      description: resource.description,
      url_or_storage_path: resource.url_or_storage_path || '',
      tags: resource.tags || [],
      image_url: resource.image_url || '',
    });
    setShowResourceForm(true);
  };

  // COUNCIL CRUD
  const handleCouncilSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setUploadingCouncilImage(true);
    let photoUrl = councilForm.photo_url;

    if (councilImageFile) {
      try {
        const publicUrl = await uploadImageToStorage(councilImageFile, 'council_members');
        photoUrl = publicUrl ?? '';
      } catch (error: any) {
        setUploadCouncilImageError(error.message);
        setUploadingCouncilImage(false);
        return;
      }
    }

    try {
      const payload = {
        name: councilForm.name,
        role: councilForm.role,
        year: councilForm.year,
        linkedin_url: councilForm.linkedin_url || null,
        photo_url: photoUrl || null,
      };

      if (editingCouncilId) {
        await supabase.from('council_leaders').update(payload).eq('id', editingCouncilId);
        setMessage('Council member updated successfully!');
      } else {
        await supabase.from('council_leaders').insert([payload]);
        setMessage('Council member added successfully!');
      }

      setShowCouncilForm(false);
      setEditingCouncilId(null);
      setCouncilForm({ name: '', role: '', year: '', linkedin_url: '', photo_url: '' });
      setCouncilImageFile(null);
      fetchCouncilLeaders();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploadingCouncilImage(false);
    }
  };

  const deleteCouncilMember = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this council member?')) return;
    try {
      await supabase.from('council_leaders').delete().eq('id', id);
      setMessage('Council member deleted successfully!');
      fetchCouncilLeaders();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const editCouncilMember = (member: CouncilLeader) => {
    setEditingCouncilId(member.id);
    setCouncilForm({
      name: member.name,
      role: member.role,
      year: member.year,
      linkedin_url: member.linkedin_url || '',
      photo_url: member.photo_url || '',
    });
    setShowCouncilForm(true);
  };

  // AWARENESS CRUD
  const handleAwarenessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setUploadingAwarenessImage(true);
    let bannerUrl = awarenessForm.banner_url;

    if (awarenessImageFile) {
      try {
        const publicUrl = await uploadImageToStorage(awarenessImageFile, 'monthly_awareness');
        bannerUrl = publicUrl ?? '';
      } catch (error: any) {
        setUploadingAwarenessImage(false);
        setMessage(`Error: ${error.message}`);
        return;
      }
    }

    try {
      const payload = {
        month: awarenessForm.month,
        theme: awarenessForm.theme,
        message: awarenessForm.message,
        resource_url: awarenessForm.resource_url || null,
        icon: awarenessForm.icon,
        banner_url: bannerUrl || null,
        caption: awarenessForm.caption || null,
      };

      if (editingAwarenessId) {
        await supabase.from('monthly_awareness').update(payload).eq('id', editingAwarenessId);
        setMessage('Awareness entry updated successfully!');
      } else {
        await supabase.from('monthly_awareness').insert([payload]);
        setMessage('Awareness entry added successfully!');
      }

      setShowAwarenessForm(false);
      setEditingAwarenessId(null);
      setAwarenessForm({ month: '', theme: '', message: '', resource_url: '', icon: 'sun', banner_url: '', caption: '' });
      setAwarenessImageFile(null);
      fetchAwareness();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploadingAwarenessImage(false);
    }
  };

  const deleteAwareness = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this awareness entry?')) return;
    try {
      await supabase.from('monthly_awareness').delete().eq('id', id);
      setMessage('Awareness entry deleted successfully!');
      fetchAwareness();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const editAwareness = (entry: any) => {
    setEditingAwarenessId(entry.id);
    setAwarenessForm({
      month: entry.month || '',
      theme: entry.theme || '',
      message: entry.message || '',
      resource_url: entry.resource_url || '',
      icon: entry.icon || 'sun',
      banner_url: entry.banner_url || '',
      caption: entry.caption || '',
    });
    setShowAwarenessForm(true);
  };

  // QUOTES CRUD
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const payload = {
        text: quoteForm.text,
        author: quoteForm.author,
      };

      if (editingQuoteId) {
        await supabase.from('quotes').update(payload).eq('id', editingQuoteId);
        setMessage('Quote updated successfully!');
      } else {
        await supabase.from('quotes').insert([payload]);
        setMessage('Quote added successfully!');
      }

      setShowQuoteForm(false);
      setEditingQuoteId(null);
      setQuoteForm({ text: '', author: '' });
      fetchQuotes();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const editQuote = (quote: Quote) => {
    setEditingQuoteId(quote.id);
    setQuoteForm({
      text: quote.text,
      author: quote.author || '',
    });
    setShowQuoteForm(true);
  };

  const deleteQuote = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this quote?')) return;
    try {
      await supabase.from('quotes').delete().eq('id', id);
      setMessage('Quote deleted successfully!');
      fetchQuotes();
      fetchStats();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // AUTH
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage('Database not configured');
      return;
    }

    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    } catch (error) {
      setMessage('Sign in failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!supabase) {
      setMessage('Database not configured');
      return;
    }

    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) setMessage(error.message);
      else setMessage('Check your email for confirmation. Admin access is granted once your email is whitelisted in the admins table.');
    } catch (error) {
      setMessage('Sign up failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  // LOADING
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

  // AUTH FORMS
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Access</h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? 'Sign in to access the admin dashboard' : 'Create an admin account'}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={isLogin ? handleSignIn : handleSignUp}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900 bg-white"
                  required
                />
              </div>
            )}

            {message && (
              <div className="p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">{message}</div>
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
          <p className="text-gray-600">Signed in as <span className="font-medium">{user?.email}</span>.</p>
          <p className="text-gray-600">Your email is not on the admin list. Ask a site admin to add your email to the <span className="font-medium">public.admins</span> table.</p>
          <button
            onClick={handleSignOut}
            className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {message && (
          <div className="mb-6 p-4 rounded-md bg-green-50 text-green-700 border border-green-200">{message}</div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white border border-gray-200 rounded-xl h-fit p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">SMHC Admin</h2>
              <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
            </div>
            <nav className="space-y-2">
              {[
                { id: 'dashboard' as const, label: 'Dashboard Overview', icon: HomeIcon },
                { id: 'gallery' as const, label: '📸 Gallery Manager', icon: null },
                { id: 'events' as const, label: '📅 Event Manager', icon: CalendarIcon },
                { id: 'resources' as const, label: '📚 Resource Manager', icon: BookIcon },
                { id: 'council' as const, label: '🧑‍🤝‍🧑 Council Management', icon: PeopleIcon },
                { id: 'awareness' as const, label: 'Monthly Awareness', icon: SunIcon },
                { id: 'quotes' as const, label: '📝 Quotes Manager', icon: ChatIcon },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab.id ? 'bg-blue-50 text-su-blue' : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={handleSignOut}
                  className="w-full bg-su-blue text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-su-blue"><CalendarIcon className="w-6 h-6" /></div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Events</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-600"><BookIcon className="w-6 h-6" /></div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Resources</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-600"><PeopleIcon className="w-6 h-6" /></div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Gallery Events</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalGalleryEvents}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-600"><PeopleIcon className="w-6 h-6" /></div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Council Leaders</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalCouncilLeaders}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">📸 Gallery Manager</h2>
                  <button
                    onClick={() => {
                      setShowGalleryForm(true);
                      setEditingGalleryId(null);
                      setGalleryForm({ title: '', short_description: '', cover_image: '' });
                    }}
                    className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Gallery Event
                  </button>
                </div>

                {showGalleryForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingGalleryId ? 'Edit Gallery Event' : 'Add Gallery Event'}
                    </h3>
                    <form onSubmit={handleGallerySubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={galleryForm.short_description}
                          onChange={(e) => setGalleryForm({ ...galleryForm, short_description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                        <input
                          type="file"
                          onChange={(e) => setGalleryImageFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                          accept="image/*"
                        />
                        {uploadingGalleryImage && <p className="text-su-blue text-sm mt-2">Uploading...</p>}
                        {uploadGalleryImageError && <p className="text-red-500 text-sm mt-2">{uploadGalleryImageError}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={uploadingGalleryImage}
                          className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {editingGalleryId ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowGalleryForm(false);
                            setEditingGalleryId(null);
                          }}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-6">
                  {galleryEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.short_description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingGalleryId(event.id);
                              setGalleryForm({
                                title: event.title,
                                short_description: event.short_description,
                                cover_image: event.cover_image || '',
                              });
                              setShowGalleryForm(true);
                            }}
                            className="text-su-blue hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteGalleryEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Images and Videos for this gallery event */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Media ({galleryImages.filter(img => img.gallery_event_id === event.id).length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                          {galleryImages.filter(img => img.gallery_event_id === event.id).map(image => (
                            <div key={image.id} className="relative">
                              {image.media_type === 'video' ? (
                                <video
                                  src={image.image_url}
                                  controls
                                  muted
                                  className="w-full h-32 object-cover rounded-md"
                                />
                              ) : (
                                <img
                                  src={image.image_url}
                                  alt={image.caption || 'Gallery image'}
                                  className="w-full h-32 object-cover rounded-md"
                                />
                              )}
                              <button
                                onClick={() => deleteGalleryImage(image.id)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                              >
                                ✕
                              </button>
                              {image.caption && (
                                <p className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded truncate">
                                  {image.caption}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {showGalleryImageUpload === event.id ? (
                          <form onSubmit={(e) => handleAddGalleryImage(e, event.id)} className="border-t pt-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Images & Video (Max 5 images + 1 video ≤ 20MB)
                              </label>
                              <input
                                type="file"
                                multiple
                                onChange={(e) => handleGalleryFilesChange(e.target.files)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                                accept="image/*,video/*"
                                required={galleryFiles.length === 0 && !galleryVideoFile}
                              />
                              {galleryUploadError && (
                                <p className="text-red-600 text-sm mt-2">{galleryUploadError}</p>
                              )}
                            </div>

                            {/* Preview Section */}
                            {(galleryImagePreviews.length > 0 || galleryVideoPreview) && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                                  {galleryImagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                      <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-20 object-cover rounded border"
                                      />
                                      <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                        {index + 1}
                                      </span>
                                    </div>
                                  ))}
                                  {galleryVideoPreview && (
                                    <div className="relative">
                                      <video
                                        src={galleryVideoPreview}
                                        className="w-full h-20 object-cover rounded border"
                                        muted
                                      />
                                      <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                        Video
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">Caption (optional)</label>
                              <input
                                type="text"
                                value={galleryImageForm.caption}
                                onChange={(e) => setGalleryImageForm({ ...galleryImageForm, caption: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                                placeholder="Applies to all uploaded files"
                              />
                            </div>
                            <div className="flex space-x-2 mt-3">
                              <button
                                type="submit"
                                disabled={galleryFiles.length === 0 && !galleryVideoFile}
                                className="bg-su-blue text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                              >
                                Upload {galleryFiles.length > 0 && `${galleryFiles.length} images`}
                                {galleryVideoFile && ' + 1 video'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowGalleryImageUpload(null);
                                  clearGalleryFiles();
                                }}
                                className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => setShowGalleryImageUpload(event.id)}
                            className="text-sm text-su-blue hover:text-blue-700 font-medium"
                          >
                            + Add Images/Video
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">📅 Event Manager</h2>
                  <button
                    onClick={() => {
                      setShowEventForm(true);
                      setEditingEventId(null);
                      setEventForm({ title: '', slug: '', description: '', start: '', end: '', location: '', calendar_link: '', image_url: '' });
                    }}
                    className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Event
                  </button>
                </div>

                {showEventForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{editingEventId ? 'Edit Event' : 'Add Event'}</h3>
                    <form onSubmit={handleEventSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={eventForm.description}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="datetime-local"
                            value={eventForm.start}
                            onChange={(e) => setEventForm({ ...eventForm, start: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="datetime-local"
                            value={eventForm.end}
                            onChange={(e) => setEventForm({ ...eventForm, end: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Learn More URL</label>
                        <input
                          type="url"
                          value={eventForm.calendar_link}
                          onChange={(e) => setEventForm({ ...eventForm, calendar_link: e.target.value })}
                          placeholder="https://example.com/details-or-registration"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-su-blue text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: external page, registration, or calendar link</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input
                          type="file"
                          onChange={(e) => setEventImageFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          accept="image/*"
                        />
                        {uploadingEventImage && <p className="text-su-blue text-sm mt-2">Uploading...</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={uploadingEventImage}
                          className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {editingEventId ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEventForm(false)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map(event => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(event.start).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => editEvent(event)}
                              className="text-su-blue hover:text-blue-700"
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

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">📚 Resource Manager</h2>
                  <button
                    onClick={() => {
                      setShowResourceForm(true);
                      setEditingResourceId(null);
                      setResourceForm({ title: '', category: 'article', url_or_storage_path: '', tags: [], description: '', image_url: '' });
                    }}
                    className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Resource
                  </button>
                </div>

                {showResourceForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{editingResourceId ? 'Edit Resource' : 'Add Resource'}</h3>
                    <form onSubmit={handleResourceSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={resourceForm.title}
                          onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={resourceForm.category}
                          onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value as 'article' | 'wellness_tools' | 'podcast' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          required
                        >
                          <option value="article">Article</option>
                          <option value="wellness_tools">Wellness Tools</option>
                          <option value="podcast">Podcast</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={resourceForm.description}
                          onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                        <input
                          type="text"
                          value={resourceForm.url_or_storage_path}
                          onChange={(e) => setResourceForm({ ...resourceForm, url_or_storage_path: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input
                          type="file"
                          onChange={(e) => setResourceImageFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          accept="image/*"
                        />
                        {uploadingResourceImage && <p className="text-su-blue text-sm mt-2">Uploading...</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={uploadingResourceImage}
                          className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {editingResourceId ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowResourceForm(false)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {resources.map(resource => (
                        <tr key={resource.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => editResource(resource)}
                              className="text-su-blue hover:text-blue-700"
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

            {/* COUNCIL TAB */}
            {activeTab === 'council' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">🧑‍🤝‍🧑 Council Management</h2>
                  <button
                    onClick={() => {
                      setShowCouncilForm(true);
                      setEditingCouncilId(null);
                      setCouncilForm({ name: '', role: '', year: '', linkedin_url: '', photo_url: '' });
                    }}
                    className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Member
                  </button>
                </div>

                {showCouncilForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{editingCouncilId ? 'Edit Member' : 'Add Member'}</h3>
                    <form onSubmit={handleCouncilSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={councilForm.name}
                            onChange={(e) => setCouncilForm({ ...councilForm, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <input
                            type="text"
                            value={councilForm.role}
                            onChange={(e) => setCouncilForm({ ...councilForm, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <input
                            type="text"
                            value={councilForm.year}
                            onChange={(e) => setCouncilForm({ ...councilForm, year: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                        <input
                          type="file"
                          onChange={(e) => setCouncilImageFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          accept="image/*"
                        />
                        {uploadingCouncilImage && <p className="text-su-blue text-sm mt-2">Uploading...</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={uploadingCouncilImage}
                          className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {editingCouncilId ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCouncilForm(false)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {councilLeaders.map(leader => (
                    <div key={leader.id} className="bg-white rounded-lg shadow-md p-6">
                      {leader.photo_url && (
                        <img
                          src={leader.photo_url}
                          alt={leader.name}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <p className="text-sm text-su-blue font-medium">{leader.role}</p>
                      {leader.year && <p className="text-sm text-gray-600">{leader.year}</p>}
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => editCouncilMember(leader)}
                          className="flex-1 text-su-blue hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCouncilMember(leader.id)}
                          className="flex-1 text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AWARENESS TAB */}
            {activeTab === 'awareness' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Monthly Awareness</h2>
                  <button
                    onClick={() => {
                      setShowAwarenessForm(true);
                      setEditingAwarenessId(null);
                      setAwarenessForm({ month: '', theme: '', message: '', resource_url: '', icon: 'sun', banner_url: '', caption: '' });
                    }}
                    className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Entry
                  </button>
                </div>

                {showAwarenessForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{editingAwarenessId ? 'Edit Entry' : 'Add Entry'}</h3>
                    <form onSubmit={handleAwarenessSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                          <input
                            type="text"
                            value={awarenessForm.month}
                            onChange={(e) => setAwarenessForm({ ...awarenessForm, month: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                          <input
                            type="text"
                            value={awarenessForm.theme}
                            onChange={(e) => setAwarenessForm({ ...awarenessForm, theme: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                          value={awarenessForm.message}
                          onChange={(e) => setAwarenessForm({ ...awarenessForm, message: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                        <input
                          type="file"
                          onChange={(e) => setAwarenessImageFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          accept="image/*"
                        />
                        {uploadingAwarenessImage && <p className="text-su-blue text-sm mt-2">Uploading...</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={uploadingAwarenessImage}
                          className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {editingAwarenessId ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAwarenessForm(false)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {awarenessEntries.map(entry => (
                    <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{entry.month} - {entry.theme}</h3>
                          <p className="text-gray-600 mt-2">{entry.message}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editAwareness(entry)}
                            className="text-su-blue hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAwareness(entry.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quotes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">📝 Quotes Manager</h2>
                  <button
                    onClick={() => {
                      setShowQuoteForm(true);
                      setEditingQuoteId(null);
                      setQuoteForm({ text: '', author: '' });
                    }}
                    className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Quote
                  </button>
                </div>

                {showQuoteForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{editingQuoteId ? 'Edit Quote' : 'Add Quote'}</h3>
                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text</label>
                        <textarea
                          value={quoteForm.text}
                          onChange={(e) => setQuoteForm({ ...quoteForm, text: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          {editingQuoteId ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowQuoteForm(false)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">All Quotes</h3>
                  <ul className="space-y-3">
                    {quotes.map(q => (
                      <li key={q.id} className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-900 font-medium">{q.author || 'Unknown'}</p>
                          <p className="text-gray-700">{q.text}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editQuote(q)}
                            className="text-sm bg-blue-50 text-su-blue px-3 py-1 rounded-md hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteQuote(q.id)}
                            className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
