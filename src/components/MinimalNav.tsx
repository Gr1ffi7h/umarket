/**
 * Minimal Navigation Component
 * 
 * Clean, compact navigation bar with essential links only
 * Mobile-responsive with collapsible menu
 * Lightweight design with minimal visual bulk
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import dynamic from 'next/dynamic';
import { auth } from '@/lib/auth-supabase';

// Dynamic import for ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle').then(mod => ({ default: mod.ThemeToggle })), {
  ssr: false,
  loading: () => (
    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
  ),
});

/**
 * Minimal Navigation Component
 * 
 * Provides clean navigation with authentication-aware links
 * Uses compact spacing and minimal styling
 */
export function MinimalNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const { data: authListener } = auth.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      if (typeof window !== 'undefined') {
        authListener?.subscription.unsubscribe();
      }
    };
  }, []);

  const publicNavItems = [
    { href: '/login', label: 'Sign In' },
    { href: '/signup', label: 'Sign Up' },
  ];

  const protectedNavItems = [
    { href: '/browse', label: 'Browse' },
    { href: '/create-listing', label: 'Create' },
    { href: '/messages', label: 'Messages' },
    { href: '/profile', label: 'Profile' },
  ];

  const handleProtectedNavClick = (href: string) => {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!user) {
        e.preventDefault();
        window.location.href = `/login?returnTo=${encodeURIComponent(href)}`;
      }
    };
  };

  const navItems = user ? protectedNavItems : publicNavItems;

  return (
    <nav className="border-b border-gray-200 dark:border-primary-700 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
              UMarket
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {loading ? (
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              navItems.map((item) => {
                const isProtected = !user && protectedNavItems.some(nav => nav.href === item.href);
                return (
                  <Button
                    key={item.href}
                    href={item.href}
                    variant="ghost"
                    size="sm"
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                    onClick={isProtected ? handleProtectedNavClick(item.href) : undefined}
                  >
                    {item.label}
                  </Button>
                );
              })
            )}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            {!loading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-text-secondary-light dark:text-text-secondary-dark"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!loading && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-primary-700">
            <div className="py-2 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  href={item.href}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
