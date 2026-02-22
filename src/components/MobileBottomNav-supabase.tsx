/**
 * Mobile Bottom Navigation Component
 * 
 * App-style bottom tab navigation for mobile devices with Supabase auth
 * Hidden on desktop, visible on mobile
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  PlusCircle, 
  MessageSquare, 
  User, 
  Search 
} from 'lucide-react';

export function MobileBottomNav() {
  const { session, loading } = useAuth();
  const router = useRouter();

  const handleProtectedNav = (e: React.MouseEvent, href: string) => {
    if (!session) {
      e.preventDefault();
      router.push(`/login?returnTo=${encodeURIComponent(href)}`);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="grid grid-cols-4 gap-1 py-2">
        {/* Home/Browse */}
        <Link
          href="/browse"
          onClick={(e) => handleProtectedNav(e, '/browse')}
          className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95 duration-150"
        >
          <Search size={20} />
          <span className="text-xs mt-1">Browse</span>
        </Link>

        {/* Sell/Create */}
        <Link
          href="/create-listing"
          onClick={(e) => handleProtectedNav(e, '/create-listing')}
          className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95 duration-150"
        >
          <PlusCircle size={20} />
          <span className="text-xs mt-1">Sell</span>
        </Link>

        {/* Messages */}
        <Link
          href="/messages"
          onClick={(e) => handleProtectedNav(e, '/messages')}
          className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95 duration-150"
        >
          <MessageSquare size={20} />
          <span className="text-xs mt-1">Messages</span>
        </Link>

        {/* Profile */}
        {session ? (
          <Link
            href="/profile"
            className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95 duration-150"
          >
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95 duration-150"
          >
            <User size={20} />
            <span className="text-xs mt-1">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
