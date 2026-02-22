/**
 * Minimal Browse Page Component
 * 
 * Compact marketplace with reduced visual bulk
 * Clean grid layout with minimal spacing
 * Lightweight design optimized for fast browsing
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ClientHeader } from '@/components/ClientHeader';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { auth } from '@/lib/auth-supabase';
import { listingsService } from '@/lib/listings';

// Prevent static generation during build
export const dynamic = "force-dynamic";

function BrowsePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');

  const categories = ['All', 'Electronics', 'Books', 'Furniture', 'Clothing', 'Appliances'];
  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];

  useEffect(() => {
    const loadListings = async () => {
      // Check authentication
      const isAuth = await auth.isAuthenticated();
      if (!isAuth) {
        window.location.href = '/login';
        return;
      }

      // Load listings from database
      const allListings = await listingsService.getListings();
      setListings(allListings);
      setLoading(false);
    };

    loadListings();

    // Set up real-time subscription
    const subscription = listingsService.subscribeToListings((newListing) => {
      setListings(prev => [newListing, ...prev]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredListings = listings.filter(listing => {
    const categoryMatch = selectedCategory === 'All' || listing.category === selectedCategory;
    const conditionMatch = selectedCondition === 'All' || listing.condition === selectedCondition;
    return categoryMatch && conditionMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <ClientHeader />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-primary-700 rounded p-3">
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

  if (filteredListings.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <ClientHeader />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-text-primary-light dark:text-text-primary-dark mb-4">
              No listings found
            </h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Try adjusting your filters or be the first to post something!
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
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="active:scale-95 transition-transform duration-150"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">Condition</h3>
              <div className="flex flex-wrap gap-2">
                {conditions.map(condition => (
                  <Button
                    key={condition}
                    variant={selectedCondition === condition ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCondition(condition)}
                    className="active:scale-95 transition-transform duration-150"
                  >
                    {condition}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Listings Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
              className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-primary-700 rounded-xl p-4 md:hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <div className="w-full h-24 bg-gray-200 dark:bg-primary-800 rounded mb-3 flex items-center justify-center">
                {listing.image ? (
                  <Image 
                    src={listing.image} 
                    alt={listing.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">No Image</span>
                )}
              </div>
              <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1 truncate">
                {listing.title}
              </h3>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                ${listing.price}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {listing.category}
                </span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {listing.condition}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default BrowsePage;
