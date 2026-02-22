/**
 * 404 Not Found Page
 * 
 * Clean, modern error page with navigation options
 * Helps users find what they're looking for
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Here are some helpful links:
            </h3>
            <div className="space-y-3">
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  🏠 Home
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" className="w-full justify-start">
                  🛍 Browse Marketplace
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button variant="outline" className="w-full justify-start">
                  ➕ Create Listing
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Or try searching for what you need:</p>
            <Link href="/browse" className="text-blue-600 hover:text-blue-800 underline">
              Browse all items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
