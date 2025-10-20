'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import type { AboutContent, TeamMember } from '../../types/database.types';
import { EyeIcon, LightningIcon, PeopleIcon, EmailIcon } from '../../components/icons';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      if (!supabase) {
        // Default about content
        setAboutContent({
          id: '1',
          ...(aboutContent as any),
          mission: 'To promote mental health awareness and provide support for all students at Strathmore University.',
          vision: 'A campus community where mental health is prioritized, stigma is eliminated, and all students have access to the support they need.',
          history: 'The Strathmore Mental Health Club was founded in 2020 by a group of passionate students who recognized the need for greater mental health awareness and support on campus.',
          values: ['Compassion', 'Confidentiality', 'Inclusivity', 'Education', 'Advocacy'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Default team members
        setTeamMembers([
          {
            id: '1',
            name: 'Jane Doe',
            role: 'President',
            bio: 'Psychology student passionate about mental health advocacy.',
            photo_url: '/images/team-1.jpg',
            email: 'jane.doe@strathmore.edu',
            linkedin_url: 'https://linkedin.com/in/jane-doe',
            created_at: new Date().toISOString()
          }
        ]);
        setLoading(false);
        return;
      }

      // Fetch about page content
      const { data: aboutData, error: aboutError } = await supabase
        .from('about_content')
        .select('*')
        .single();

      // Fetch team members
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .order('order');

      if (aboutError || teamError) {
        console.error('Error fetching about content:', aboutError || teamError);

        // Default about content
        setAboutContent({
          id: '1',
          ...(aboutContent as any),
          mission: 'To promote mental health awareness and provide support for all students at Strathmore University.',
          vision: 'A campus community where mental health is prioritized, stigma is eliminated, and all students have access to the support they need.',
          history: 'The Strathmore Mental Health Club was founded in 2020 by a group of passionate students who recognized the need for greater mental health awareness and support on campus.',
          values: ['Compassion', 'Confidentiality', 'Inclusivity', 'Education', 'Advocacy'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Default team members
        setTeamMembers([
          {
            id: '1',
            name: 'Jane Doe',
            role: 'President',
            bio: 'Psychology student passionate about mental health advocacy.',
            photo_url: '/images/team-1.jpg',
            email: 'jane.doe@strathmore.edu',
            linkedin_url: 'https://linkedin.com/in/jane-doe',
            created_at: new Date().toISOString()
          }
        ]);
      } else {
        setAboutContent(aboutData);
        setTeamMembers(teamData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-su-blue to-blue-700 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">About the Mental Health Club</h1>
            <p className="text-xl text-gray-100">Building a supportive community for student mental wellbeing</p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-su-blue">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-su-blue rounded-full flex items-center justify-center mr-4">
                <LightningIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-su-blue">Our Mission</h2>
            </div>
            <p className="text-gray-800 leading-relaxed text-lg">{(aboutContent as any)?.mission}</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-su-red">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-su-red rounded-full flex items-center justify-center mr-4">
                <EyeIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-su-red">Our Vision</h2>
            </div>
            <p className="text-gray-800 leading-relaxed text-lg">{(aboutContent as any)?.vision}</p>
          </div>
        </div>

        {/* History Section */}
        <div className="mb-20 bg-su-gold bg-opacity-5 rounded-lg p-8 border-l-4 border-su-gold">
          <h2 className="text-2xl font-bold text-su-blue mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{(aboutContent as any)?.history}</p>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-su-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <PeopleIcon className="w-8 h-8 text-su-blue" />
            </div>
            <h2 className="text-3xl font-bold text-su-blue mb-2">Meet Our Team</h2>
            <p className="text-gray-600">The amazing people driving our mission forward</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow border border-gray-100">
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="w-full h-full bg-gradient-to-br from-su-blue to-su-red rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{member.name}</h3>
                <p className="text-su-blue font-semibold mb-3 text-center">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">{member.bio}</p>
                {member.email && (
                  <div className="border-t pt-4">
                    <a href={`mailto:${member.email}`} className="text-su-blue hover:text-blue-700 text-sm flex items-center justify-center font-medium">
                      <EmailIcon className="w-4 h-4 mr-2" />
                      {member.email}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        {(aboutContent as any)?.values && (aboutContent as any).values.length > 0 && (
          <div className="my-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-su-blue mb-2">Our Values</h2>
              <p className="text-gray-600">What guides our mission and actions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {(aboutContent as any).values.map((value: string, index: number) => (
                <div key={index} className="bg-su-blue text-white rounded-lg p-6 text-center hover:bg-blue-800 transition-colors">
                  <p className="font-semibold text-lg">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="bg-su-red text-white py-16 rounded-lg text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Interested in joining our team or volunteering? We&apos;re always looking for passionate students to help us make a difference.
          </p>
          <a
            href="mailto:mentalhealth@strathmore.edu"
            className="bg-white text-su-red px-8 py-3 rounded-md hover:bg-gray-100 transition-colors inline-flex items-center font-semibold"
          >
            <EmailIcon className="w-5 h-5 mr-2" />
            Contact Us to Get Involved
          </a>
        </div>
      </div>
    </div>
  );
}
