'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
// The Footer type is not exported from the database.types module,
// so we define a minimal local type matching the expected shape.
type FooterType = {
  med_centre_contact: string;
  club_email: string;
  emergency_numbers: string;
};

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
    emergency_numbers: 'Emergency Helpline: 1199 <br /> Counseling Hotline: +254 (0) 703-034555 <br /> Red Cross Helpline: 0711 035 000',
  };

  const data = footerData || defaultFooterData;

  return (
    <footer className="bg-su-blue text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <p className="mb-2" dangerouslySetInnerHTML={{ __html: data.emergency_numbers }}></p>
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

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/su_mentalhealthclub/" target="_blank" rel="noopener noreferrer" className="hover:text-su-gold">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
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
