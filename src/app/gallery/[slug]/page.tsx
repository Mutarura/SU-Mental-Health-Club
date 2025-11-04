'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import type { GalleryEvent, GalleryImage } from '../../../types/database.types';

const SAMPLE_GALLERY_EVENTS: Record<string, { event: GalleryEvent; images: GalleryImage[] }> = {
  'mental-health-week-2025': {
    event: {
      id: '1',
      title: 'Mental Health Week 2025',
      slug: 'mental-health-week-2025',
      short_description: 'A comprehensive week celebrating mental health awareness with workshops, seminars, and community support activities across campus.',
      created_at: new Date().toISOString(),
    },
    images: [
      {
        id: '1',
        gallery_event_id: '1',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        caption: 'Opening ceremony for Mental Health Week',
        display_order: 1,
      },
      {
        id: '2',
        gallery_event_id: '1',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        caption: 'Workshop participants engaged in discussion',
        display_order: 2,
      },
      {
        id: '3',
        gallery_event_id: '1',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        caption: 'Panel discussion with mental health professionals',
        display_order: 3,
      },
      {
        id: '4',
        gallery_event_id: '1',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        caption: 'Community support session',
        display_order: 4,
      },
    ],
  },
  'wellness-day-celebration': {
    event: {
      id: '2',
      title: 'Wellness Day Celebration',
      slug: 'wellness-day-celebration',
      short_description: 'A day dedicated to celebrating wellness with yoga sessions, meditation circles, art therapy, and wellness talks from experts.',
      created_at: new Date().toISOString(),
    },
    images: [
      {
        id: '5',
        gallery_event_id: '2',
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
        caption: 'Yoga session in the morning',
        display_order: 1,
      },
      {
        id: '6',
        gallery_event_id: '2',
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
        caption: 'Meditation circle gathering',
        display_order: 2,
      },
    ],
  },
  'peer-support-initiative-launch': {
    event: {
      id: '3',
      title: 'Peer Support Initiative Launch',
      slug: 'peer-support-initiative-launch',
      short_description: 'The launch of our peer support program with training sessions, community building activities, and recognition of our support leaders.',
      created_at: new Date().toISOString(),
    },
    images: [
      {
        id: '7',
        gallery_event_id: '3',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        caption: 'Training session for peer supporters',
        display_order: 1,
      },
    ],
  },
};

export default function GalleryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [galleryEvent, setGalleryEvent] = useState<GalleryEvent | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!slug) return;
    fetchGalleryData();
  }, [slug]);

  const fetchGalleryData = async () => {
    try {
      if (!supabase) {
        // Use sample data
        const sample = SAMPLE_GALLERY_EVENTS[slug];
        if (sample) {
          setGalleryEvent(sample.event);
          setGalleryImages(sample.images);
        } else {
          // Gallery event not found
          setGalleryEvent(null);
          setGalleryImages([]);
        }
        setLoading(false);
        return;
      }

      // Fetch gallery event
      const { data: eventData, error: eventError } = await supabase
        .from('gallery_events')
        .select('*')
        .eq('slug', slug)
        .single();

      if (eventError || !eventData) {
        console.error('Error fetching gallery event:', eventError);
        const sample = SAMPLE_GALLERY_EVENTS[slug];
        if (sample) {
          setGalleryEvent(sample.event);
          setGalleryImages(sample.images);
        } else {
          setGalleryEvent(null);
          setGalleryImages([]);
        }
        setLoading(false);
        return;
      }

      setGalleryEvent(eventData);

      // Fetch images for this gallery event
      const { data: imagesData, error: imagesError } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_event_id', eventData.id)
        .order('display_order', { ascending: true });

      if (!imagesError && imagesData) {
        setGalleryImages(imagesData);
      }
    } catch (error) {
      console.error('Error:', error);
      const sample = SAMPLE_GALLERY_EVENTS[slug];
      if (sample) {
        setGalleryEvent(sample.event);
        setGalleryImages(sample.images);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (imageId: string) => {
    setImageErrors((prevErrors) => ({ ...prevErrors, [imageId]: true }));
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!galleryEvent) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gallery Not Found</h1>
          <p className="text-gray-600 mb-8">The gallery event you're looking for doesn't exist.</p>
          <Link href="/gallery" className="inline-block bg-su-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/gallery"
            className="inline-flex items-center text-su-blue hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Gallery
          </Link>
          <h1 className="text-4xl font-bold text-su-blue mb-4">{galleryEvent.title}</h1>
          <div className="w-24 h-1 bg-su-red mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl">{galleryEvent.short_description}</p>
        </div>

        {/* Images Grid */}
        {galleryImages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No images in this gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Image Container */}
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {!imageErrors[image.id] ? (
                    <img
                      src={image.image_url}
                      alt={image.caption || 'Gallery image'}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={() => handleImageError(image.id)}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p className="text-gray-400 text-sm">Image not available</p>
                    </div>
                  )}
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="p-4 bg-white">
                    <p className="text-sm text-gray-700 text-center">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
