'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Event } from '../../types/database.types';
import { CalendarIcon, LocationIcon, ClockIcon } from '../../components/icons';

const DEFAULT_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Mental Health Awareness Week',
    slug: 'mental-health-awareness-week',
    description: 'A week-long series of events focused on raising awareness about mental health issues among university students. Join us for seminars, discussions, panel talks with mental health professionals, and resource sharing sessions.',
    start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Strathmore University Main Campus - Multipurpose Hall',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Stress Management Workshop',
    description: 'Learn effective techniques to manage academic stress and maintain well-being during exam periods. Expert facilitators will guide breathing exercises, progressive muscle relaxation, and mindfulness practices tailored for students.',
    slug: 'stress-management-workshop',
    start: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Student Center, Room 301',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Peer Support Circle',
    slug: 'peer-support-circle',
    description: 'A safe, confidential space for students to share experiences and support one another. No judgment, just community care and understanding. Led by trained peer supporters from our club council.',
    start: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Library Lounge, 3rd Floor',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Self-Care and Wellness Day',
    slug: 'self-care-and-wellness-day',
    description: 'Join us for a day dedicated to self-care activities including yoga, meditation, art therapy, and wellness talks. Bring yourself and leave feeling rejuvenated and supported.',
    start: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Sports Complex - Wellness Center',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Navigating Academic Pressure',
    slug: 'navigating-academic-pressure',
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    description: 'A discussion panel featuring academics, counselors, and successful students sharing strategies on how to manage academic pressure while maintaining mental health and work-life balance.',
    start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Main Auditorium',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleImageError = (eventId: string) => {
    setImageErrors((prevErrors) => ({ ...prevErrors, [eventId]: true }));
  };

  useEffect(() => {
    fetchEvents();

    if (supabase) {
      const channel = supabase.channel('events-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
        .subscribe();
      return () => {
        channel.unsubscribe();
      };
    }
  }, []);

  const fetchEvents = async () => {
    try {
      if (!supabase) {
        setEvents(DEFAULT_EVENTS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('start', { ascending: true });

        if (error) {
          console.warn('Database error (using fallback data):', error.message);
          setEvents(DEFAULT_EVENTS);
        } else {
          setEvents(data && data.length > 0 ? data : DEFAULT_EVENTS);
        }
      } catch (dbError) {
        console.warn('Database connection error (using fallback data):', dbError);
        setEvents(DEFAULT_EVENTS);
      }
    } catch (error) {
      console.warn('Error fetching events:', error);
      setEvents(DEFAULT_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.start) >= now);
  const pastEvents = events.filter(event => new Date(event.start) < now);

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
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-su-blue mb-4">📅 Events</h1>
          <div className="w-24 h-1 bg-su-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join us for workshops, support groups, and awareness events designed to promote mental health and well-being in our community.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-6 border-b-2 border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`relative pb-2 px-1 text-lg font-semibold transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-su-blue'
                  : 'text-gray-600 hover:text-su-blue'
              }`}
            >
              <span className="inline-flex items-center gap-3">
                Upcoming Events
                <span className={`inline-flex items-center justify-center text-xs font-bold rounded-full px-3 py-1 ${
                  activeTab === 'upcoming'
                    ? 'bg-su-blue text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {upcomingEvents.length}
                </span>
              </span>
              {activeTab === 'upcoming' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-su-red rounded-t"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`relative pb-2 px-1 text-lg font-semibold transition-colors ${
                activeTab === 'past'
                  ? 'text-su-blue'
                  : 'text-gray-600 hover:text-su-blue'
              }`}
            >
              <span className="inline-flex items-center gap-3">
                Past Events
                <span className={`inline-flex items-center justify-center text-xs font-bold rounded-full px-3 py-1 ${
                  activeTab === 'past'
                    ? 'bg-su-blue text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {pastEvents.length}
                </span>
              </span>
              {activeTab === 'past' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-su-red rounded-t"></div>
              )}
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {activeTab === 'upcoming' && (
          <div>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No upcoming events at this time. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* upcoming events card */}
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                    {/* Image Container */}
                    <div className="relative h-56 bg-gradient-to-br from-su-blue to-blue-600 overflow-hidden flex items-center justify-center">
                      {event.image_url && !imageErrors[event.id] ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={() => handleImageError(event.id)}
                        />
                      ) : (
                        <div className="text-center">
                          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CalendarIcon className="w-12 h-12 text-white" />
                          </div>
                          <p className="text-white/70 text-sm font-medium">No image</p>
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold text-white bg-green-500 shadow-lg">
                          Upcoming
                        </span>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-6">
                      {/* Date & Time */}
                      <div className="flex items-center gap-3 text-sm text-su-blue font-semibold mb-3">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(event.start)}</span>
                        <ClockIcon className="w-4 h-4 ml-2" />
                        <span>{formatTime(event.start)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-su-blue transition-colors">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Location */}
                      <div className="flex items-start gap-2 text-sm text-gray-700 mb-5 pb-5 border-b border-gray-200">
                        <LocationIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-su-red" />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>

                      {/* CTA Button */}
                      {event.calendar_link ? (
                        <a
                          href={event.calendar_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-block text-center bg-su-blue text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
                        >
                          Learn More
                        </a>
                      ) : (
                        <div className="w-full text-center text-xs text-gray-500">No external link provided</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Past Events Tab */}
        {activeTab === 'past' && (
          <div>
            {pastEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No past events found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* past events card */}
                {pastEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group opacity-75 hover:opacity-100">
                    {/* Image Container */}
                    <div className="relative h-56 bg-gradient-to-br from-gray-400 to-gray-600 overflow-hidden flex items-center justify-center">
                      {event.image_url && !imageErrors[event.id] ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={() => handleImageError(event.id)}
                        />
                      ) : (
                        <div className="text-center">
                          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CalendarIcon className="w-12 h-12 text-white" />
                          </div>
                          <p className="text-white/70 text-sm font-medium">No image</p>
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold text-white bg-gray-500 shadow-lg">
                          Past Event
                        </span>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-6">
                      {/* Date & Time */}
                      <div className="flex items-center gap-3 text-sm text-gray-600 font-semibold mb-3">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(event.start)}</span>
                        <ClockIcon className="w-4 h-4 ml-2" />
                        <span>{formatTime(event.start)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Location */}
                      <div className="flex items-start gap-2 text-sm text-gray-700 pb-5 border-b border-gray-200">
                        <LocationIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>

                      {/* Info and Link */}
                      <div className="mt-5 flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">This event has concluded</p>
                        {event.calendar_link && (
                          <a
                            href={event.calendar_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-gray-100 text-su-blue px-3 py-1 rounded-md hover:bg-gray-200"
                          >
                            Learn More
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
