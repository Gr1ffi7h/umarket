/**
 * Minimal Client Header Component
 * 
 * Client-side wrapper for minimal navigation
 * Ensures proper hydration for interactive elements
 * Uses compact design with reduced visual bulk
 */

'use client';

import { auth } from '@/lib/auth-supabase';
import { MinimalNav } from '@/components/MinimalNav';

/**
 * Minimal Client Header Component
 * 
 * Wraps MinimalNav for client-side rendering
 * Maintains SSR compatibility with dynamic imports
 */
export function ClientHeader() {
  return <MinimalNav />;
}
