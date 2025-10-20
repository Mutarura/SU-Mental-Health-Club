'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import type { Resource } from '../../types/database.types';
import { BookIcon, DocumentIcon } from '../../components/icons';

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

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      if (!supabase) {
        setResources(DEFAULT_RESOURCES);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching resources:', error);
        setResources(DEFAULT_RESOURCES);
      } else {
        setResources(data && data.length > 0 ? data : DEFAULT_RESOURCES);
      }
    } catch (error) {
      console.error('Error:', error);
      setResources(DEFAULT_RESOURCES);
    } finally {
      setLoading(false);
    }
  };

  // Function to get appropriate icon based on resource category
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('article') || lowerCategory.includes('blog')) {
      return <DocumentIcon className="w-4 h-4 text-su-red" />;
    } else if (lowerCategory.includes('guide') || lowerCategory.includes('help')) {
      return <DocumentIcon className="w-4 h-4 text-su-red" />;
    } else {
      return <BookIcon className="w-4 h-4 text-su-red" />;
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

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full p-2 shadow-md mr-4">
              <div className="w-full h-full bg-gradient-to-br from-su-blue to-su-red rounded-full flex items-center justify-center">
                <BookIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-su-blue">Mental Health Resources</h1>
          </div>
          <div className="w-24 h-1 bg-su-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access articles, guides, and resources to support your mental health journey.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-su-red bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                    {getCategoryIcon(resource.category)}
                  </div>
                  <span className="text-sm font-medium text-su-red">{resource.category}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{resource.description}</p>
                {resource.url_or_storage_path ? (
                  <a
                    href={resource.url_or_storage_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-su-blue text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium inline-block text-center"
                  >
                    Read Article
                  </a>
                ) : (
                  <button disabled className="w-full bg-gray-400 text-white py-3 px-6 rounded-md cursor-not-allowed font-medium">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
