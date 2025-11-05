'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Resource } from '../../types/database.types';
import { BookIcon, DocumentIcon, SoundIcon } from '../../components/icons';

const DEFAULT_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety Disorders: Symptoms and Treatment',
    category: 'Guide',
    description: 'Learn about different types of anxiety disorders, how to recognize symptoms, and evidence-based treatment approaches including CBT and mindfulness techniques.',
    url_or_storage_path: 'https://www.nami.org/Get-Involved/Awareness-Events/Mental-Illness-Awareness-Week',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'The Science Behind Sleep and Mental Health',
    category: 'Article',
    description: 'Discover why sleep is crucial for mental health and learn science-backed strategies for improving sleep quality, reducing insomnia, and managing sleep disorders.',
    url_or_storage_path: 'https://www.sleepfoundation.org/mental-health',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Mindfulness Meditation for Stress Relief',
    category: 'Guide',
    description: 'Step-by-step guide to practicing mindfulness meditation, with practical exercises designed for students, professionals, and anyone managing daily stress.',
    url_or_storage_path: 'https://www.mindful.org/meditation/mindfulness-getting-started/',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Building Resilience and Coping Skills',
    category: 'Article',
    description: 'Develop emotional resilience through proven techniques like reframing thoughts, building support networks, and practicing self-compassion during difficult times.',
    url_or_storage_path: 'https://www.psychologytoday.com/us/basics/resilience',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Depression: Recognition and Recovery Pathways',
    category: 'Guide',
    description: 'Comprehensive information on depression symptoms, how to seek professional help, available treatments including therapy and medication options, and self-care strategies.',
    url_or_storage_path: 'https://www.samhsa.gov/mental-health',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Time Management and Work-Life Balance',
    category: 'Article',
    description: 'Practical time management strategies for students and professionals to balance responsibilities, reduce overwhelm, and maintain mental wellbeing while achieving goals.',
    url_or_storage_path: 'https://www.mindful.org/how-to-make-your-to-do-list-work-for-your-wellbeing/',
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Recognizing and Managing Stress',
    category: 'Guide',
    description: 'Learn to identify stress triggers, understand the physical and emotional effects of chronic stress, and implement healthy coping mechanisms for better mental health.',
    url_or_storage_path: 'https://www.apa.org/topics/stress',
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Social Connections and Mental Wellbeing',
    category: 'Article',
    description: 'Explore how meaningful relationships and social connections reduce anxiety and depression, combat loneliness, and contribute to overall mental health and happiness.',
    url_or_storage_path: 'https://www.mentalhealthamerica.net/conditions/social-health-and-mental-health',
    created_at: new Date().toISOString(),
  },
];

// Function to get appropriate icon based on resource category
const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('article') || lowerCategory.includes('blog')) {
    return <DocumentIcon className="w-4 h-4 text-white" />;
  } else if (lowerCategory.includes('guide') || lowerCategory.includes('help')) {
    return <DocumentIcon className="w-4 h-4 text-white" />;
  } else {
    return <BookIcon className="w-4 h-4 text-white" />;
  }
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'articles' | 'podcasts' | 'tools'>('articles');

  useEffect(() => {
    fetchResources();

    if (supabase) {
      const channel = supabase.channel('resources-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, fetchResources)
        .subscribe();
      return () => {
        channel.unsubscribe();
      };
    }
  }, []);

  const fetchResources = async () => {
    try {
      if (!supabase) {
        setResources(DEFAULT_RESOURCES);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Database error (using fallback data):', error.message);
          setResources(DEFAULT_RESOURCES);
        } else {
          setResources(data && data.length > 0 ? data : DEFAULT_RESOURCES);
        }
      } catch (dbError) {
        console.warn('Database connection error (using fallback data):', dbError);
        setResources(DEFAULT_RESOURCES);
      }
    } catch (error) {
      console.warn('Error fetching resources:', error);
      setResources(DEFAULT_RESOURCES);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getTitleIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('article') || c.includes('blog')) return <DocumentIcon className="w-5 h-5 text-su-blue mr-2" />;
    if (c.includes('guide') || c.includes('help')) return <DocumentIcon className="w-5 h-5 text-su-blue mr-2" />;
    return <BookIcon className="w-5 h-5 text-su-blue mr-2" />;
  };

  // Tab data
  const articlesAndGuides = resources.filter((r) => {
    const c = (r.category || '').toLowerCase();
    return c.includes('article') || c.includes('guide');
  });
  const podcasts = resources.filter((r) => (r.category || '').toLowerCase() === 'podcast');
  const tools = resources.filter((r) => {
    const c = (r.category || '').toLowerCase();
    return !(c.includes('article') || c.includes('guide') || c === 'podcast');
  });
  const list = activeTab === 'articles' ? articlesAndGuides : activeTab === 'podcasts' ? podcasts : tools;

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full p-2 shadow-md mr-4">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <BookIcon className="w-8 h-8 text-su-blue" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-su-blue flex items-center justify-center">
              Mental Health Resources
            </h1>
          </div>
          <div className="w-24 h-1 bg-su-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access articles, guides, and resources to support your mental health journey.
          </p>
        </div>

        {/* Professional Tabs */}
        <div className="mt-4">
          <nav className="relative flex items-center gap-10 border-b border-gray-200">
            <button
              role="tab"
              aria-selected={activeTab === 'articles'}
              onClick={() => setActiveTab('articles')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('articles'); }}
              className={`relative -mb-px px-1 pb-3 pt-2 text-base font-semibold focus:outline-none ${activeTab === 'articles' ? 'text-su-blue' : 'text-gray-800 hover:text-su-blue'}`}
            >
              <span className="inline-flex items-center gap-2">
                <DocumentIcon className="w-5 h-5" />
                📖 Articles & Guides
                <span className={`${activeTab === 'articles' ? 'bg-blue-50 text-su-blue' : 'bg-gray-100 text-gray-700'} inline-flex items-center justify-center text-xs font-semibold rounded-full px-2 py-0.5`}>{articlesAndGuides.length}</span>
              </span>
              {activeTab === 'articles' && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-su-blue rounded-t"></span>
              )}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'podcasts'}
              onClick={() => setActiveTab('podcasts')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('podcasts'); }}
              className={`relative -mb-px px-1 pb-3 pt-2 text-base font-semibold focus:outline-none ${activeTab === 'podcasts' ? 'text-su-blue' : 'text-gray-800 hover:text-su-blue'}`}
            >
              <span className="inline-flex items-center gap-2">
                Podcasts
                <span className={`${activeTab === 'podcasts' ? 'bg-blue-50 text-su-blue' : 'bg-gray-100 text-gray-700'} inline-flex items-center justify-center text-xs font-semibold rounded-full px-2 py-0.5`}>{podcasts.length}</span>
              </span>
              {activeTab === 'podcasts' && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-su-blue rounded-t"></span>
              )}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'tools'}
              onClick={() => setActiveTab('tools')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('tools'); }}
              className={`relative -mb-px px-1 pb-3 pt-2 text-base font-semibold focus:outline-none ${activeTab === 'tools' ? 'text-su-blue' : 'text-gray-800 hover:text-su-blue'}`}
            >
              <span className="inline-flex items-center gap-2">
                Wellness Tools
                <span className={`${activeTab === 'tools' ? 'bg-blue-50 text-su-blue' : 'bg-gray-100 text-gray-700'} inline-flex items-center justify-center text-xs font-semibold rounded-full px-2 py-0.5`}>{tools.length}</span>
              </span>
              {activeTab === 'tools' && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-su-blue rounded-t"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {list.map((resource) => {
            const cat = (resource.category || '').toLowerCase();
            const isArticle = cat.includes('article') || cat.includes('guide');
            const isPodcast = cat === 'podcast';
            const barBg = isArticle ? 'bg-green-100' : isPodcast ? 'bg-blue-100' : 'bg-yellow-100';
            const barText = isArticle ? 'text-green-700' : isPodcast ? 'text-su-blue' : 'text-yellow-700';
            const label = isArticle ? 'Article' : isPodcast ? 'Podcast' : 'Tool';
            const ctaLabel = isArticle ? 'Read Article' : isPodcast ? 'Listen' : 'Open Tool';
            return (
              <div key={resource.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Icon pill */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mr-3">
                      {getCategoryIcon(resource.category)}
                    </div>
                  </div>
                  {/* Category bar */}
                  <div className={`relative w-full h-5 ${barBg} rounded-full mb-4`}>
                    <span className={`absolute inset-y-0 left-3 flex items-center text-xs font-semibold ${barText}`}>{label}</span>
                  </div>
                  {/* Title and description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{resource.description}</p>
                  {resource.url_or_storage_path ? (
                    <a
                      href={resource.url_or_storage_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-su-red text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
                    >
                      {ctaLabel}
                    </a>
                  ) : (
                    <button disabled className="inline-flex items-center justify-center bg-gray-400 text-white px-6 py-3 rounded-md font-medium cursor-not-allowed">
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
