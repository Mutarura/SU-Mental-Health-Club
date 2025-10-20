'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Event } from '../../types/database.types';
import { CalendarIcon, LocationIcon, LightbulbIcon, HeartIcon, PeopleIcon } from '../../components/icons';

const DEFAULT_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Mental Health Awareness Week',
    description: 'A week-long series of events focused on raising awareness about mental health issues among university students. Join us for seminars, discussions, panel talks with mental health professionals, and resource sharing sessions.',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Strathmore University Main Campus - Multipurpose Hall',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Stress Management Workshop',
    description: 'Learn effective techniques to manage academic stress and maintain well-being during exam periods. Expert facilitators will guide breathing exercises, progressive muscle relaxation, and mindfulness practices tailored for students.',
    date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Student Center, Room 301',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Peer Support Circle',
    description: 'A safe, confidential space for students to share experiences and support one another. No judgment, just community care and understanding. Led by trained peer supporters from our club council.',
    date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Library Lounge, 3rd Floor',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Self-Care and Wellness Day',
    description: 'Join us for a day dedicated to self-care activities including yoga, meditation, art therapy, and wellness talks. Bring yourself and leave feeling rejuvenated and supported.',
    date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Sports Complex - Wellness Center',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Navigating Academic Pressure',
    description: 'A discussion panel featuring academics, counselors, and successful students sharing strategies on how to manage academic pressure while maintaining mental health and work-life balance.',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Main Auditorium',
    image_url: undefined,
    created_at: new Date().toISOString(),
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      if (!supabase) {
        setEvents(DEFAULT_EVENTS);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        setEvents(DEFAULT_EVENTS);
      } else {
        setEvents(data && data.length > 0 ? data : DEFAULT_EVENTS);
      }
    } catch (error) {
      console.error('Error:', error);
      setEvents(DEFAULT_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-64"></div>
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
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-su-blue">Events</h1>
          </div>
          <div className="w-24 h-1 bg-su-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us for workshops, support groups, and awareness events designed to promote mental health and well-being.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events scheduled at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 bg-white rounded-lg flex items-center justify-center">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-32 h-32 bg-su-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        {/* Event type icons */}
                        {event.title.toLowerCase().includes('workshop') ? (
                          <LightbulbIcon className="w-16 h-16 text-white" />
                        ) : event.title.toLowerCase().includes('meditation') || event.title.toLowerCase().includes('mindfulness') ? (
                          <HeartIcon className="w-16 h-16 text-white" />
                        ) : event.title.toLowerCase().includes('support') || event.title.toLowerCase().includes('group') ? (
                          <PeopleIcon className="w-16 h-16 text-white" />
                        ) : (
                          <CalendarIcon className="w-16 h-16 text-white" />
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-4">Event</p>
                    </div>
                  )}
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      new Date(event.date) >= now 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {new Date(event.date) >= now ? 'Upcoming' : 'Past Event'}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-6">
                    <LocationIcon className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  {new Date(event.date) >= now && (
                    <button className="bg-su-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
                      Register for Event
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
