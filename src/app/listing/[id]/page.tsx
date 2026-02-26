/**
 * Listing Details Page
 * 
 * Real-time listing details from Supabase
 * Mobile responsive design with image gallery
 * Contact seller and messaging integration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useAuth } from '@/providers/AuthProvider';
import { ListingsService, Listing } from '@/lib/listings';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = "force-dynamic";

function ListingDetailContent() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const listingId = params.id as string;

  useEffect(() => {
    const loadListing = async () => {
      try {
        const listingData = await ListingsService.getListing(listingId);
        setListing(listingData);
      } catch (error) {
        console.error('Error loading listing:', error);
        setError('Listing not found');
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      loadListing();
    }
  }, [listingId]);

  const handleContactSeller = () => {
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(`/listing/${listingId}`)}`);
      return;
    }

    // Create or navigate to conversation with seller
    router.push(`/messages?seller=${listing?.profiles?.id}&listing=${listingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Listing Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This listing doesn't exist or has been removed.
          </p>
          <Link href="/browse">
            <Button>Browse Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {listing.images && listing.images.length > 0 ? (
                <div className="relative h-96 bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={listing.images[selectedImage]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">No images available</p>
                </div>
              )}
              
              {/* Image Thumbnails */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                        selectedImage === index
                          ? 'border-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {listing.title}
              </h1>
              
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
                ${listing.price}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
                  <p className="font-medium text-gray-900 dark:text-white">{listing.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Condition</span>
                  <p className="font-medium text-gray-900 dark:text-white">{listing.condition}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Seller Information */}
              {listing.profiles && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Seller Information
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {listing.profiles.username || listing.profiles.email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {listing.profiles.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Posted {new Date(listing.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleContactSeller}
                  className="flex-1"
                  disabled={user?.id === listing.user_id}
                >
                  {user?.id === listing.user_id ? 'Your Listing' : 'Contact Seller'}
                </Button>
                <Link href="/browse">
                  <Button variant="outline">
                    Back to Browse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingDetailPage() {
  return <ListingDetailContent />;
}
