/**
 * Login Page Component
 * 
 * Clean, minimal login interface
 * Validates .edu email addresses
 * Redirects to dashboard on success
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ClientHeader } from '@/components/ClientHeader';
import { Button } from '@/components/Button';
import { auth } from '@/lib/auth';

function SearchParamsWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await auth.signIn(email, password);

      if (user) {
        router.push("/browse");
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="mb-4 p-3 bg-warning-100 dark:bg-warning-900 border border-warning-200 dark:border-warning-700 rounded text-warning-800 dark:text-warning-200 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-primary-600 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="your.email@university.edu"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-primary-600 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="••••••••••"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = () => {
      const currentUser = auth.getCurrentUser();
      if (currentUser) {
        router.push('/browse');
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <ClientHeader />
      
      <SearchParamsWrapper>
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-primary-700 rounded-lg p-6">
            <h1 className="text-xl font-medium text-text-primary-light dark:text-text-primary-dark mb-6 text-center">
              Sign In
            </h1>

            <LoginForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Don&apos;t have an account?{' '}
                <a href="/signup" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </SearchParamsWrapper>
    </div>
  );
}
