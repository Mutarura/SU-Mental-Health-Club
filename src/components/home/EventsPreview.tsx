'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import type { Event } from '../../types/database.types';
import { CalendarIcon, LocationIcon } from '../../components/icons';

export default function EventsPreview() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })
          .limit(3);

        if (error) {
          console.error('Error fetching events:', error);
        } else {
          setEvents(data || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Default events if none are available from the database
  const defaultEvents = [
    {
      id: 1,
      title: "Mental Health Awareness Week",
      description: "A week-long series of events focused on raising awareness about mental health issues among university students. Join us for seminars, discussions, and resource sharing.",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Strathmore University Main Campus - Multipurpose Hall",
      image_url: null,
    },
    {
      id: 2,
      title: "Stress Management Workshop",
      description: "Learn effective techniques to manage academic stress and maintain well-being during exam periods. Expert facilitators will guide breathing exercises and mindfulness practices.",
      date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Student Center, Room 301",
      image_url: null,
    },
    {
      id: 3,
      title: "Peer Support Circle",
      description: "A safe, confidential space for students to share experiences and support one another. No judgment, just community care and understanding.",
      date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Library Lounge, 3rd Floor",
      image_url: null,
    },
  ];

  const displayEvents = events.length > 0 ? events : defaultEvents;

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-su-blue mb-4">Upcoming Events</h2>
          <div className="w-24 h-1 bg-su-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us for these upcoming events to learn, connect, and support mental wellness in our community.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayEvents.map((event) => (
                <div key={event.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                  <div className="h-40 bg-white flex items-center justify-center">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-su-blue rounded-full flex items-center justify-center shadow-md">
                        <CalendarIcon className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-su-blue mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <LocationIcon className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                    <p className="text-gray-900 text-sm">{event.description.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link href="/events" className="inline-block bg-su-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                View All Events
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
