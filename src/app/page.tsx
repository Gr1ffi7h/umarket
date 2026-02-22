/**
 * Enhanced Landing Page
 * 
 * Structured content density while maintaining minimal aesthetic
 * Clean sections with intentional content placement
 * Modern, lightweight design optimized for engagement
 */

// Force dynamic rendering to prevent build crashes from Supabase fetches
export const dynamic = "force-dynamic";

import { Button } from '@/components/Button';
import { ClientHeader } from '@/components/ClientHeader';
import { data } from '@/lib/data';
import Link from 'next/link';

/**
 * Compact Hero Section
 * 
 * Clear value proposition with subtle CTAs
 * Clean alignment without oversized typography
 */
function CompactHero() {
  return (
    <section className="py-8 px-4 bg-gradient-to-b from-soft-50 to-background-light dark:from-primary-900 dark:to-background-dark">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-medium text-text-primary-light dark:text-text-primary-dark mb-3">
          Campus Marketplace
        </h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6 max-w-md mx-auto">
          Buy and sell with fellow students. Simple, safe, and local.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/browse" variant="primary" size="md">
            Browse Items
          </Button>
          <Button href="/create-listing" variant="outline" size="md">
            Sell Something
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * How It Works Section
 * 
 * 3 simple steps with minimal icons
 * Tight spacing and clean presentation
 */
function HowItWorks() {
  const steps = [
    { 
      title: 'Post', 
      description: 'List your items in seconds',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    { 
      title: 'Browse', 
      description: 'Find what you need locally',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      title: 'Connect', 
      description: 'Meet and exchange safely',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
  ];

  return (
    <section className="py-8 px-4 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-6 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="text-primary-600 dark:text-primary-400">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Featured Listings Preview
 * 
 * 4-6 listing cards in compact grid
 * Uses deterministic hourly algorithm for selection
 * Clean card styling with minimal information
 */
function FeaturedListings({ featuredListings }: { featuredListings: any[] }) {
  // Edge case: No listings available
  if (featuredListings.length === 0) {
    return (
      <section className="py-8 px-4 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-4">
            No listings yet
          </h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
            Be the first to post something for sale!
          </p>
          <Button href="/create-listing" variant="primary" size="md">
            Create First Listing
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 bg-surface-light dark:bg-surface-dark">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
            Featured Listings
          </h2>
          <Button href="/browse" variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredListings.map(listing => (
            <div key={listing.id} className="bg-background-light dark:bg-background-dark border border-gray-200 dark:border-primary-700 rounded p-3">
              <div className="w-full h-24 bg-gray-200 dark:bg-primary-800 rounded mb-3 flex items-center justify-center">
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">No Image</span>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Campus Focus Section
 * 
 * Short explanation about .edu verification
 * Small trust indicators
 */
function CampusFocus() {
  return (
    <section className="py-8 px-4 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-3">
          Campus-First Marketplace
        </h2>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 max-w-md mx-auto">
          Only verified students with .edu email addresses can participate. 
          This ensures a safe, trusted environment for campus trading.
        </p>
        <div className="flex justify-center gap-6 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>.edu Verification</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Campus Local</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Safe Trading</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Subtle Footer
 * 
 * Minimal links with small typography
 * Clean spacing
 */
function MinimalFooter() {
  return (
    <footer className="py-6 px-4 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-primary-700">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              Marketplace
            </h3>
            <ul className="space-y-1">
              <li><Link href="/browse" className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">Browse</Link></li>
              <li><Link href="/create-listing" className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">Sell</Link></li>
              <li><Link href="/my-listings" className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">My Listings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              Account
            </h3>
            <ul className="space-y-1">
              <li><Link href="/profile" className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">Profile</Link></li>
              <li><Link href="/messages" className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">Messages</Link></li>
              <li><Link href="/profile/edit" className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">Settings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              About
            </h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">Safety</a></li>
              <li><a href="#" className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">Terms</a></li>
              <li><a href="#" className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
          © 2024 UMarket. Campus marketplace for students.
        </div>
      </div>
    </footer>
  );
}

/**
 * Enhanced Landing Page
 * 
 * Structured content density while maintaining minimal aesthetic
 * Clean sections with intentional content placement
 */
export default async function EnhancedLandingPage() {
  // Get featured listings from local storage
  let featuredListings: any[] = [];
  
  try {
    featuredListings = data.getListings().slice(0, 6); // Get first 6 as featured
  } catch (error) {
    console.error('Error fetching featured listings:', error);
    // Continue with empty array - UI will handle gracefully
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <ClientHeader />
      
      <main>
        <CompactHero />
        <HowItWorks />
        <FeaturedListings featuredListings={featuredListings} />
        <CampusFocus />
      </main>
      
      <MinimalFooter />
    </div>
  );
}
