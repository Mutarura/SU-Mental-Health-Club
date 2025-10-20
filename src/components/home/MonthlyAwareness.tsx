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

        // Realtime sync
        const channel = supabase?.channel('awareness-realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'monthly_awareness' }, (payload) => {
            loadAwareness();
          })
          .subscribe();

        return () => {
          channel?.unsubscribe();
        };
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
                                className="min-w-[360px] md:min-w-[480px] lg:min-w-[560px] snap-start rounded-2xl shadow-md flex-shrink-0 bg-white"
                                role="listitem"
                            >
                                <div className="relative h-40 md:h-56 lg:h-64 rounded-t-2xl overflow-hidden">
                                    <div
                                        className={`absolute inset-0 ${item.banner_url ? '' : 'bg-gradient-to-r from-su-blue to-blue-700'}`}
                                        style={item.banner_url ? { backgroundImage: `url(${item.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                                    />
                                    <div className="absolute inset-0 bg-black/30" />
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-su-blue/70 flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-white/90">{item.month}</p>
                                            <h3 className="text-xl md:text-2xl font-bold text-white">
                                                {item.theme}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {item.caption && (
                                        <p className="text-gray-900 mb-2 font-medium">{item.caption}</p>
                                    )}
                                    <p className="text-gray-700 mb-4">{item.message}</p>
                                    {item.resource_url && (
                                        <Link
                                            href={item.resource_url}
                                            className="inline-block text-sm font-medium bg-su-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            aria-label={`Read more about ${item.theme}`}
                                        >
                                            Read More
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}