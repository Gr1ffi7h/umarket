/**
 * Navigation Component
 * 
 * Responsive navigation with Supabase authentication
 * Includes theme toggle and protected route handling
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const { session, loading } = useAuth();
  const router = useRouter();

  const handleProtectedNav = (e: React.MouseEvent, href: string) => {
    if (!session) {
      e.preventDefault();
      router.push(`/login?returnTo=${encodeURIComponent(href)}`);
    }
  };

  const handleLogout = async () => {
    await supabase!.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-32 rounded"></div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Header */}
        <nav className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4">
            <div className="flex justify-between h-16 items-center">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-32 rounded"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded"></div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">UMarket</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex space-x-6">
                <Link
                  href="/browse"
                  onClick={(e) => handleProtectedNav(e, '/browse')}
                  className="text-gray-700 dark:text-gray-300 md:hover:text-gray-900 dark:md:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Browse
                </Link>
                <Link
                  href="/create-listing"
                  onClick={(e) => handleProtectedNav(e, '/create-listing')}
                  className="text-gray-700 dark:text-gray-300 md:hover:text-gray-900 dark:md:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sell
                </Link>
                <Link
                  href="/messages"
                  onClick={(e) => handleProtectedNav(e, '/messages')}
                  className="text-gray-700 dark:text-gray-300 md:hover:text-gray-900 dark:md:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  onClick={(e) => handleProtectedNav(e, '/profile')}
                  className="text-gray-700 dark:text-gray-300 md:hover:text-gray-900 dark:md:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
              </div>

              {session ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/my-listings"
                    className="text-gray-700 dark:text-gray-300 md:hover:text-gray-900 dark:md:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    My Listings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 dark:text-gray-300 md:hover:text-gray-900 dark:md:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                  <ThemeToggle />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium md:hover:bg-blue-700 transition-colors active:scale-95 duration-150"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-gray-700 dark:text-gray-300 md:hover:text-gray-900 dark:md:hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                  <ThemeToggle />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">UMarket</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
