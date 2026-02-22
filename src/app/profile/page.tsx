/**
 * Minimal Profile Page Component
 * 
 * Compact profile display with reduced visual bulk
 * Clean layout with minimal spacing and elements
 * Lightweight design optimized for fast viewing
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ClientHeader } from '@/components/ClientHeader';
import { auth } from '@/lib/auth-supabase';

// Prevent static generation during build
export const dynamic = "force-dynamic";

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@university.edu',
  campus: 'University Main Campus',
  memberSince: 'January 2024',
  bio: 'Computer Science major, interested in tech and books. Always looking for good deals!',
  avatar: '/api/placeholder/80/80',
  stats: {
    totalListings: 12,
    activeListings: 3,
    soldItems: 9,
    averageResponseTime: '1 hour',
  },
  recentActivity: [
    {
      id: '1',
      type: 'listing',
      title: 'MacBook Pro 14"',
      timestamp: '2024-01-15T14:30:00Z',
      status: 'active',
    },
    {
      id: '2',
      type: 'sale',
      title: 'Calculus Textbook',
      timestamp: '2024-01-14T10:15:00Z',
      status: 'sold',
    },
    {
      id: '3',
      type: 'message',
      title: 'Message from Jane Smith',
      timestamp: '2024-01-13T16:45:00Z',
      status: 'unread',
    },
  ],
};

/**
 * Minimal Profile Page Component
 * 
 * Displays user profile with compact layout
 * Reduced spacing and minimal visual elements
 */
export default function MinimalProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <ClientHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <ClientHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Not Logged In</h2>
            <p className="text-gray-600 dark:text-gray-300">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ClientHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-1">
                {user?.fullName || 'User'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {user?.email || 'user@university.edu'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                University Campus • Member since {memberSince}
              </p>
            </div>
            <Button
              href="/profile/edit"
              variant="outline"
              size="sm"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Stats
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              Stats and activity tracking coming soon.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              href="/my-listings"
              variant="outline"
              size="sm"
              className="w-full"
            >
              My Listings
            </Button>
            <Button
              href="/messages"
              variant="outline"
              size="sm"
              className="w-full"
            >
              Messages
            </Button>
            <Button
              href="/create-listing"
              variant="outline"
              size="sm"
              className="w-full"
            >
              Create Listing
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Recent Activity
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              No recent activity yet.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            href="/create-listing"
            variant="primary"
            size="lg"
            className="flex-1"
          >
            Create New Listing
          </Button>
          <Button
            href="/browse"
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Browse Marketplace
          </Button>
        </div>
      </main>
    </div>
  );
}
