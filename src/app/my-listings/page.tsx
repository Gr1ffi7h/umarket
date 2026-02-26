/**
 * My Listings Page Component
 * 
 * Displays user's marketplace listings in a grid layout
 * Features listing management with edit/delete actions
 * Responsive design with dark mode support
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { useAuth } from '@/providers/AuthProvider';
import { ProtectedPage } from '@/components/ProtectedPage';
import { ListingsService, Listing } from '@/lib/listings';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic";

const categories = ['All', 'Electronics', 'Books', 'Furniture', 'Clothing', 'Appliances'];
const statuses = ['All', 'Active', 'Sold', 'Removed'];

function MyListingsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadListings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const userListings = await ListingsService.getUserListings(user.id);
        setListings(userListings);
      } catch (error) {
        setError('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [user]);

  // Filter listings based on filters
  const filteredListings = listings.filter(listing => {
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || listing.status === selectedStatus.toLowerCase();
    return matchesCategory && matchesStatus;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  /**
   * Handle listing deletion
   */
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await ListingsService.deleteListing(listingId);
      setListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Failed to delete listing');
    }
  };

  /**
   * Handle listing status change
   */
  const handleStatusChange = async (listingId: string, newStatus: string) => {
    try {
      await ListingsService.updateListing(listingId, { status: newStatus.toLowerCase() as any });
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: newStatus.toLowerCase() as any }
          : listing
      ));
    } catch (error) {
      console.error('Error updating listing status:', error);
      setError('Failed to update listing status');
    }
  };

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
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              My Listings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your marketplace listings
            </p>
          </div>
          <Link href="/create-listing">
            <Button>
              Create Listing
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: Low</option>
                <option value="price-high">Price: High</option>
                <option value="views">Most Views</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {sortedListings.length} {sortedListings.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>

        {/* Listings Grid */}
        {sortedListings.length > 0 ? (
          <div className="space-y-3">
            {sortedListings.map(listing => (
              <div
                key={listing.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          No Image
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {listing.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            listing.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            ${listing.price}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {listing.category}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {listing.condition}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Posted {new Date(listing.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Link href={`/listing/${listing.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {listing.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(listing.id, 'sold')}
                      >
                        Mark Sold
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteListing(listing.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-sm mb-2">
              No listings found
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start by creating your first listing
            </p>
            <Link href="/create-listing">
              <Button>
                Create Listing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <ProtectedPage>
      <MyListingsContent />
    </ProtectedPage>
  );
}
