/**
 * Protected Page Component
 * 
 * Production-ready protection for authenticated routes
 * Eliminates redirect loops and loading issues
 */

'use client'

import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/Button'
import Link from 'next/link'

interface ProtectedPageProps {
  children: React.ReactNode
  redirectTo?: string
  showAccessDenied?: boolean
}

/**
 * Protected Page Wrapper
 * 
 * Features:
 * - No redirect loops
 * - Proper loading states
 * - Access denied UI instead of redirects
 * - Production ready
 */
export function ProtectedPage({ 
  children, 
  redirectTo = '/login',
  showAccessDenied = true 
}: ProtectedPageProps) {
  const { user, loading, error } = useAuth()

  // Show loading while auth is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error if auth failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Authentication Error
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {typeof error === 'string' ? error : error.message}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show access denied if no user
  if (!user && showAccessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3.5-9.5L12 3l-1.5 1.5M12 3l1.5 1.5M12 3v6m0 6h.01M12 15h.01" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Sign In Required
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please sign in to access this page.
            </p>
            
            <div className="space-y-3">
              <Link href={redirectTo}>
                <Button className="w-full">
                  Sign In
                </Button>
              </Link>
              
              <Link href="/signup">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              Don't have an account? Sign up for free.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show children if authenticated
  if (user) {
    return <>{children}</>
  }

  // Fallback (shouldn't reach here)
  return null
}

/**
 * Protected Section Component
 * 
 * For smaller sections within a page that need protection
 */
export function ProtectedSection({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please sign in to view this content
        </p>
        <Link href="/login">
          <Button size="sm">Sign In</Button>
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
