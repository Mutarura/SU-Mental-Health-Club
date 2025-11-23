'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import type { Event } from '../../types/database.types';
import { CalendarIcon, LocationIcon, ClockIcon } from '../../components/icons';
import { error } from 'console';

export default function EventsPreview() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (eventId: string) => {
    setImageErrors((prevErrors) => ({ ...prevErrors, [eventId]: true }));
  };

  useEffect(() => {
    fetchEvents();

    if (supabase) {
      const channel = supabase.channel('events-preview-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
        .subscribe();
      return () => {
        channel.unsubscribe();
      };
    }
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        setEvents([]); // No supabase, no events
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start', new Date().toISOString()) // only upcoming events
        .order('start', { ascending: true })
        .limit(3);

      if (error) {
        console.warn('Database error:', error.message);
        setEvents([]); // On error, show no events
      } else {
        setEvents(data || []); // If no data, set empty array
      }
    } catch (error) {
      console.warn('Error fetching events:', error);
      setEvents([]); // On error, show no events
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Filter again defensively (covers fallback/defaults)
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.start) >= now);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-su-blue mb-4">Upcoming Events</h2>
          <div className="w-24 h-1 bg-su-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join us for these upcoming events to learn, connect, and support mental wellness in our community.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        ) : (
          <>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600 text-lg mb-4">No upcoming events, see past events.</p>
                <Link href="/events" className="inline-block bg-su-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                  View All Events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 overflow-hidden group h-full">
                    {/* Image Container */}
                    <div className="relative h-48 bg-gradient-to-br from-su-blue to-blue-600 overflow-hidden flex items-center justify-center">
                      {event.image_url && !imageErrors[event.id] ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={() => handleImageError(event.id)}
                        />
                      ) : (
                        <div className="text-center">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CalendarIcon className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-white/70 text-xs">Event</p>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Upcoming
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Date & Time */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-su-blue font-semibold mb-3">
                        <span className="inline-flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {formatDate(event.start)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {formatTime(event.start)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-su-blue transition-colors">
                        {event.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-start gap-2 text-xs text-gray-600 mb-3">
                        <LocationIcon className="w-3 h-3 mt-0.5 flex-shrink-0 text-su-red" />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </p>

                      {/* CTA Row */}
                      {event.calendar_link && (
                        <div className="mt-4">
                          <Link
                            href={event.calendar_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-su-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                          >
                            Learn More
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}


          </>
        )}
      </div>
    </section>
  );
}
