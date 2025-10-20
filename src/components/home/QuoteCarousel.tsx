'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Quote } from '../../types/database.types';

export default function QuoteCarousel() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching quotes:', error);
        } else {
          setQuotes(data || []);
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length > 1) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => 
          prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000); // Change quote every 8 seconds

      return () => clearInterval(interval);
    }
  }, [quotes]);

  // Default quotes if none are available from the database
  const defaultQuotes = [
    {
      id: 1,
      text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
      author: "Noam Shpancer",
    },
    {
      id: 2,
      text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious.",
      author: "Lori Deschene",
    },
    {
      id: 3,
      text: "Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.",
      author: "Akshay Dubey",
    },
    {
      id: 4,
      text: "Your mental health is a priority, not a luxury. Take care of yourself with the same dedication you give to others.",
      author: "Unknown",
    },
    {
      id: 5,
      text: "It's okay to not be okay. But it's not okay to stay that way. Seek help, reach out, and remember you're not alone.",
      author: "Strathmore Mental Health Club",
    },
  ];

  const displayQuotes = quotes.length > 0 ? quotes : defaultQuotes;
  const currentQuote = displayQuotes[currentQuoteIndex];

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {loading ? (
          <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
        ) : (
          <>
            <div className="text-5xl text-su-blue mb-6">❝</div>
            <blockquote className="text-2xl font-light italic text-gray-900 mb-6">
              {currentQuote.text}
            </blockquote>
            <p className="text-lg font-medium text-su-blue">— {currentQuote.author}</p>
          </>
        )}
      </div>
    </section>
  );
}
