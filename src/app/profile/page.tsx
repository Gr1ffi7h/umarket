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
import { useAuth } from '@/context/AuthContext';
import { ProtectedPage } from '@/components/ProtectedPage';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export const dynamic = "force-dynamic";

function ProfileContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    soldItems: 0,
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        // Load user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Load user stats
        const { data: listingsData } = await supabase
          .from('listings')
          .select('status')
          .eq('user_id', user.id);

        const totalListings = listingsData?.length || 0;
        const activeListings = listingsData?.filter(l => l.status === 'active').length || 0;
        const soldItems = listingsData?.filter(l => l.status === 'sold').length || 0;

        setStats({ totalListings, activeListings, soldItems });
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {profile?.full_name || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {user?.email || 'user@university.edu'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile?.campus || 'University Campus'} • Member since {memberSince}
              </p>
              {profile?.bio && (
                <p className="text-gray-600 dark:text-gray-300 mt-3">
                  {profile.bio}
                </p>
              )}
            </div>
            <Link href="/profile/edit">
              <Button variant="outline">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.totalListings}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Listings
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stats.activeListings}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Active Listings
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stats.soldItems}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Sold Items
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/my-listings">
              <Button variant="outline" className="w-full">
                My Listings
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="outline" className="w-full">
                Messages
              </Button>
            </Link>
            <Link href="/create-listing">
              <Button variant="outline" className="w-full">
                Create Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/create-listing">
            <Button className="flex-1">
              Create New Listing
            </Button>
          </Link>
          <Link href="/browse">
            <Button variant="outline" className="flex-1">
              Browse Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedPage>
      <ProfileContent />
    </ProtectedPage>
  );
}
