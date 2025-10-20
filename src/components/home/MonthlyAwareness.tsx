'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MONTHLY_AWARENESS } from '../../data/monthlyAwareness';
import {
  SunIcon,
  HeartIcon,
  LightbulbIcon,
  BalanceIcon,
  ChatIcon,
  PeopleIcon,
} from '../../components/icons';
import { supabase } from '../../lib/supabase';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  sun: SunIcon,
  heart: HeartIcon,
  lightbulb: LightbulbIcon,
  balance: BalanceIcon,
  chat: ChatIcon,
  people: PeopleIcon,
};

export default function MonthlyAwareness() {
    const [items, setItems] = useState(MONTHLY_AWARENESS);

    useEffect(() => {
        async function loadAwareness() {
            if (!supabase) return;
            try {
                const { data, error } = await supabase
                  .from('monthly_awareness')
                  .select('*')
                  .order('created_at', { ascending: true });
                if (!error && data && data.length > 0) {
                  setItems(data);
                }
            } catch (err) {
                console.error('Error fetching monthly awareness:', err);
            }
        }
        loadAwareness();
    }, []);

    return (
        <section aria-label="Monthly Awareness" className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-su-blue mb-2">Monthly Awareness</h2>
                    <p className="text-gray-600">Timely themes to support mental well-being</p>
                    <div className="w-24 h-1 bg-su-red mx-auto mt-4" />
                </div>
    
                <div
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0"
                    role="list"
                    aria-label="Monthly awareness items"
                >
                    {items.map((item) => {
                        const Icon = item.icon ? iconMap[item.icon] ?? SunIcon : SunIcon;
                        return (
                            <div
                                key={item.id}
                                className="min-w-[240px] md:min-w-[280px] snap-start bg-white rounded-2xl shadow-md p-6 flex-shrink-0"
                                role="listitem"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-14 h-14 rounded-full bg-su-blue/10 flex items-center justify-center">
                                        <Icon className="w-7 h-7 text-su-blue" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-su-black/70">{item.month}</p>
                                        <h3 className="text-lg font-semibold text-su-blue">{item.theme}</h3>
                                    </div>
                                </div>
    
                                <p className="text-gray-700 mb-4">{item.message}</p>
                                {item.resource_url && (
                                    <Link
                                        href={item.resource_url}
                                        className="inline-block text-sm font-medium bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        aria-label={`Learn more about ${item.theme}`}
                                    >
                                        Learn More
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}