'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SunIcon } from '../icons';
import type * as databaseTypes from '../../types/database.types';
import { MONTHLY_AWARENESS as DEFAULT_AWARENESS } from '../../data/monthlyAwareness';

export default function MonthlyAwarenessCarousel() {
  const [awarenessEntries, setAwarenessEntries] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwareness = async () => {
      if (!supabase) {
        setAwarenessEntries(DEFAULT_AWARENESS);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('monthly_awareness')
        .select('*')
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        setAwarenessEntries(DEFAULT_AWARENESS);
      } else {
        setAwarenessEntries(data);
      }
      setLoading(false);
    };

    fetchAwareness();
  }, []);

  useEffect(() => {
    if (awarenessEntries.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % awarenessEntries.length);
      }, 8000); // Change slide every 8 seconds

      return () => clearTimeout(timer);
    }
  }, [currentIndex, awarenessEntries.length]);

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto my-10 px-4">
        <div className="bg-gray-200 animate-pulse p-8 rounded-2xl shadow-md text-center h-64"></div>
      </section>
    );
  }

  if (awarenessEntries.length === 0) {
    return null;
  }

  const currentEntry = awarenessEntries[currentIndex];

  return (
    <section className="max-w-5xl mx-auto my-10 px-4">
      <div className="bg-su-blue text-white p-8 rounded-2xl shadow-md text-center transition-opacity duration-1000">
        <div className="flex justify-end">
          <div className="w-12 h-12 rounded-full bg-su-gold flex items-center justify-center">
            <SunIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">
          {currentEntry.month}: {currentEntry.theme}
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          {currentEntry.message}
        </p>
        <div className="mt-6">
          <div className="w-16 h-1 bg-su-gold mx-auto"></div>
        </div>
      </div>
    </section>
  );
}