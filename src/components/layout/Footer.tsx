'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import type { Footer as FooterType } from '../../types/database.types';

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('footer')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching footer data:', error);
        } else {
          setFooterData(data);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);

  // Default footer data if none is available from the database
  const defaultFooterData = {
    med_centre_contact: 'Strathmore Medical Centre: +254 (0) 703-034000',
    club_email: 'mentalhealthclub@strathmore.edu',
    emergency_numbers: 'Emergency Helpline: 1199 | Counseling Hotline: +254 (0) 703-034555',
  };

  const data = footerData || defaultFooterData;

  return (
    <footer className="bg-su-blue text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="mb-2">{data.med_centre_contact}</p>
            <p className="mb-2">
              <a href={`mailto:${data.club_email}`} className="hover:text-su-gold">
                {data.club_email}
              </a>
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <p className="mb-2">{data.emergency_numbers}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="hover:text-su-gold">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-su-gold">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/peer-support" className="hover:text-su-gold">
                  Peer Support
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-su-gold">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-su-gold/30">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Strathmore Mental Health Club. All rights reserved.
          </p>
          <p className="text-center text-sm mt-2">
            <strong>Privacy Statement:</strong> This site does not collect personal identifying data.
          </p>
        </div>
      </div>
    </footer>
  );
}
