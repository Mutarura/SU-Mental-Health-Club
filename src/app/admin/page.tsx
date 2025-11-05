'use client';

import { BarChart3, Calendar, BookOpen, Image, Users } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';

const DASHBOARD_CARDS = [
  {
    title: 'Events',
    description: 'Manage upcoming events and workshops',
    icon: Calendar,
    href: '/admin/events',
    color: 'bg-blue-50 text-su-blue',
    count: 0,
  },
  {
    title: 'Resources',
    description: 'Create and organize support resources',
    icon: BookOpen,
    href: '/admin/resources',
    color: 'bg-green-50 text-green-600',
    count: 0,
  },
  {
    title: 'Gallery',
    description: 'Upload and manage gallery images',
    icon: Image,
    href: '/admin/gallery',
    color: 'bg-purple-50 text-purple-600',
    count: 0,
  },
  {
    title: 'Council Members',
    description: 'Manage council member profiles',
    icon: Users,
    href: '/admin/council',
    color: 'bg-red-50 text-su-red',
    count: 0,
  },
];

export default function AdminDashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to the Strathmore Mental Health Club Admin Panel. Manage your content and operations efficiently."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {DASHBOARD_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className={`p-6 rounded-lg ${card.color} shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-current/10`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{card.title}</h3>
                  <p className="text-sm opacity-75">{card.description}</p>
                </div>
                <Icon className="w-8 h-8 opacity-50" />
              </div>
              <div className="text-3xl font-bold opacity-90">{card.count}</div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-su-blue mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/events?action=new">
            <Button
              variant="primary"
              fullWidth
              className="justify-center"
              icon={<Calendar className="w-5 h-5" />}
            >
              New Event
            </Button>
          </Link>
          <Link href="/admin/resources?action=new">
            <Button
              variant="primary"
              fullWidth
              className="justify-center"
              icon={<BookOpen className="w-5 h-5" />}
            >
              New Resource
            </Button>
          </Link>
          <Link href="/admin/gallery?action=new">
            <Button
              variant="primary"
              fullWidth
              className="justify-center"
              icon={<Image className="w-5 h-5" />}
            >
              Upload Image
            </Button>
          </Link>
          <Link href="/admin/council">
            <Button
              variant="primary"
              fullWidth
              className="justify-center"
              icon={<Users className="w-5 h-5" />}
            >
              Edit Members
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-br from-su-blue to-blue-700 rounded-lg p-8 text-white">
          <h3 className="text-xl font-bold mb-3">Getting Started</h3>
          <p className="text-blue-100 mb-4">
            Use the admin panel to manage all content for the Strathmore Mental Health Club website. Each section includes full CRUD operations.
          </p>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>✓ Add, edit, and delete events</li>
            <li>✓ Create support resources and guides</li>
            <li>✓ Upload and organize gallery images</li>
            <li>✓ Manage council member information</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-su-red to-red-700 rounded-lg p-8 text-white">
          <h3 className="text-xl font-bold mb-3">Database Connection</h3>
          <p className="text-red-100 mb-4">
            This admin panel is ready to connect to Supabase. Configure your database tables and environment variables:
          </p>
          <ul className="space-y-2 text-sm text-red-100">
            <li>• Set NEXT_PUBLIC_SUPABASE_URL</li>
            <li>• Set NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>• Create tables in Supabase</li>
            <li>• Update API calls in components</li>
          </ul>
        </div>
      </div>
    </>
  );
}
