/**
 * Modern Browse Page Component
 * 
 * Clean marketplace with real-time updates
 * Featured listings section
 * Optimized for mobile and performance
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ListingsService, Listing } from '@/lib/listings';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = "force-dynamic";

function FeaturedSection() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const featured = await ListingsService.getFeaturedListings();
        setFeaturedListings(featured);
      } catch (error) {
        console.error('Error loading featured listings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();

    // Update featured listings every hour
    const interval = setInterval(loadFeatured, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (featuredListings.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Items</h2>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No featured listings yet.</p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Be the first to post something!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredListings.map((listing) => (
          <Link key={listing.id} href={`/listing/${listing.id}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 overflow-hidden group">
              {listing.images && listing.images.length > 0 && (
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {listing.title}
                </h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  ${listing.price}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {listing.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{listing.category}</span>
                  <span>{listing.condition}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', 'Electronics', 'Books', 'Furniture', 'Clothing', 'Appliances'];
  const limit = 20;

  useEffect(() => {
    const loadListings = async () => {
      try {
        setError(null);
        setLoading(true);

        const listingsData = await ListingsService.getListings(
          page,
          limit,
          selectedCategory === 'All' ? undefined : selectedCategory
        );

        setListings((prev) => {
          if (page <= 1) return listingsData.listings;
          const seen = new Set(prev.map((l) => l.id));
          const next = [...prev];
          for (const item of listingsData.listings) {
            if (!seen.has(item.id)) next.push(item);
          }
          return next;
        });
        setHasMore(listingsData.hasMore);
      } catch {
        setError('Failed to load listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [page, selectedCategory]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const searchResults = await ListingsService.searchListings(searchQuery, 1, limit);
      setListings(searchResults.listings);
      setHasMore(searchResults.hasMore);
      setPage(1);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || loading) return;
    setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for items..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button type="submit" disabled={!searchQuery.trim()}>
              Search
            </Button>
          </form>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Featured Section */}
        <FeaturedSection />

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setPage(1);
                  setListings([]);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            All Items ({listings.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading && listings.length === 0
              ? [...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse" />
                ))
              : listings.map((listing) => (
                  <Link key={listing.id} href={`/listing/${listing.id}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 overflow-hidden group">
                      {listing.images && listing.images.length > 0 && (
                        <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                          {listing.title}
                        </h3>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                          ${listing.price}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>{listing.category}</span>
                          <span>{listing.condition}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          {listings.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No items found. Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && listings.length > 0 && (
            <div className="text-center mt-8">
              <Button onClick={loadMore} disabled={loading} variant="outline" className="px-8">
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrowsePage;
