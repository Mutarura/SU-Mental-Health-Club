'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '../Logo';
import { MenuIcon } from '../../components/icons';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Logo size="md" showText={true} />
              </Link>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <Link href="/" className="text-su-black hover:text-su-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/events" className="text-su-black hover:text-su-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Events
              </Link>
              <Link href="/resources" className="text-su-black hover:text-su-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Resources
              </Link>
              <Link href="/about" className="text-su-black hover:text-su-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-su-black hover:text-su-blue hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-su-blue"
            >
              <span className="sr-only">Open main menu</span>
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-su-black hover:text-su-blue hover:bg-gray-50">
                Home
              </Link>
              <Link href="/events" className="block px-3 py-2 text-base font-medium text-su-black hover:text-su-blue hover:bg-gray-50">
                Events
              </Link>
              <Link href="/resources" className="block px-3 py-2 text-base font-medium text-su-black hover:text-su-blue hover:bg-gray-50">
                Resources
              </Link>
              <Link href="/about" className="block px-3 py-2 text-base font-medium text-su-black hover:text-su-blue hover:bg-gray-50">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}