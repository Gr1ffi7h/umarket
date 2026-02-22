/**
 * Authentication Guard Components
 * 
 * Provides route protection and user session management
 * Redirects unauthenticated users to login page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth-supabase';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await auth.getCurrentUser();
      setIsAuthenticated(!!user);
      setIsLoading(false);

      if (!user) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard fallback={fallback}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
