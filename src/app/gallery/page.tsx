'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import type { GalleryEvent } from '../../types/database.types';

const DEFAULT_GALLERY_EVENTS: GalleryEvent[] = [
  {
    id: '1',
    title: 'Mental Health Week 2025',
    slug: 'mental-health-week-2025',
    short_description: 'A comprehensive week celebrating mental health awareness with workshops, seminars, and community support activities across campus.',
    cover_image: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Wellness Day Celebration',
    slug: 'wellness-day-celebration',
    short_description: 'A day dedicated to celebrating wellness with yoga sessions, meditation circles, art therapy, and wellness talks from experts.',
    cover_image: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Peer Support Initiative Launch',
    slug: 'peer-support-initiative-launch',
    short_description: 'The launch of our peer support program with training sessions, community building activities, and recognition of our support leaders.',
    cover_image: undefined,
    created_at: new Date().toISOString(),
  },
];

export default function GalleryPage() {
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchGalleryEvents();

    if (supabase) {
      const channel = supabase.channel('gallery-events-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_events' }, fetchGalleryEvents)
        .subscribe();
      return () => {
        channel.unsubscribe();
      };
    }
  }, []);

  const fetchGalleryEvents = async () => {
    try {
      if (!supabase) {
        setGalleryEvents(DEFAULT_GALLERY_EVENTS);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('gallery_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery events:', error);
        setGalleryEvents(DEFAULT_GALLERY_EVENTS);
      } else {
        setGalleryEvents(data && data.length > 0 ? data : DEFAULT_GALLERY_EVENTS);
      }
    } catch (error) {
      console.error('Error:', error);
      setGalleryEvents(DEFAULT_GALLERY_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (eventId: string) => {
    setImageErrors((prevErrors) => ({ ...prevErrors, [eventId]: true }));
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-su-blue mb-4">📸 Gallery</h1>
          <div className="w-24 h-1 bg-su-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore moments from our mental health events, workshops, and community celebrations.
          </p>
        </div>

        {/* Gallery Grid */}
        {galleryEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No gallery events yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryEvents.map((event) => (
              <Link href={`/gallery/${event.slug}`} key={event.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  {/* Cover Image */}
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {event.cover_image && !imageErrors[event.id] ? (
                      <img
                        src={event.cover_image}
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={() => handleImageError(event.id)}
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-5xl mb-2">📸</div>
                        <p className="text-gray-400 text-sm">No image</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-su-blue mb-3 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{event.short_description}</p>
                    <div className="inline-block px-4 py-2 bg-su-blue text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Gallery
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
