/**
 * My Listings Page Component
 * 
 * Displays user's marketplace listings from Supabase
 * Features listing management with edit/delete actions
 * Responsive design with dark mode support
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ClientHeader } from '@/components/ClientHeader';
import { auth } from '@/lib/auth-supabase';
import { listingsService, type Listing } from '@/lib/listings';
import { AuthGuard } from '@/components/AuthGuard';

function MyListingsContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Get current user
        const currentUser = await auth.getCurrentUser();
        if (!currentUser) {
          return;
        }
        setUser(currentUser);

        // Load user's listings from database
        const userListings = await listingsService.getUserListings(currentUser.id);
        setListings(userListings);
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Set up real-time subscription for user's listings
    const setupSubscription = async () => {
      const currentUser = await auth.getCurrentUser();
      if (currentUser) {
        const subscription = listingsService.subscribeToUserListings(currentUser.id, (newListing) => {
          setListings(prev => [newListing, ...prev]);
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    };

    setupSubscription();
  }, []);

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const success = await listingsService.deleteListing(listingId);
      if (success) {
        setListings(prev => prev.filter(listing => listing.id !== listingId));
      } else {
        alert('Failed to delete listing. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <ClientHeader />
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-primary-700 rounded-xl p-4">
                <div className="w-full h-24 bg-gray-200 dark:bg-primary-800 rounded mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-primary-800 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-primary-800 rounded mb-2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <ClientHeader />
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-text-primary-light dark:text-text-primary-dark mb-4">
              You haven't created any listings yet
            </h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Start by creating your first listing to sell items on campus.
            </p>
            <Button href="/create-listing" variant="primary" size="md">
              Create First Listing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <ClientHeader />
      
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            My Listings
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Manage your marketplace listings
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-primary-700 rounded-xl p-4 md:hover:shadow-lg transition-all duration-200"
            >
              {/* Listing Image */}
              <div className="w-full h-24 bg-gray-200 dark:bg-primary-800 rounded mb-3 flex items-center justify-center">
                {listing.image ? (
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">No Image</span>
                )}
              </div>

              {/* Listing Info */}
              <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1 truncate">
                {listing.title}
              </h3>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                ${listing.price}
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {listing.category}
                </span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {listing.condition}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  href={`/create-listing?edit=${listing.id}`}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteListing(listing.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Listing Button */}
        <div className="mt-8 text-center">
          <Button href="/create-listing" variant="primary" size="lg">
            Create New Listing
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <AuthGuard>
      <MyListingsContent />
    </AuthGuard>
  );
}
