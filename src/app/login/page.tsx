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
import { auth } from '@/lib/auth-supabase';

// Password validation constants
const MIN_PASSWORD_LENGTH = 8; // Match Supabase minimum

function SearchParamsWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    
    if (passwordTrimmed.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      setLoading(false);
      return;
    }

    try {
      const user = await auth.signIn(emailTrimmed, passwordTrimmed);
      
      if (user) {
        router.push("/browse");
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      // Handle any network/fetch errors that might come through
      if (err.message?.includes('fetch') || err.message?.includes('network')) {
        setError('Failed to connect. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred');
      }
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
          className="w-full px-4 py-3 border border-gray-300 dark:border-primary-600 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent active:scale-95 transition-transform duration-150"
          placeholder="your.email@university.edu"
          required
        />
      </div>

      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-primary-600 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent active:scale-95 transition-transform duration-150"
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-2a10.025 10.025 0 01-9.543 2c-1.275 1.275-2.943 2-9.543 2a10.025 10.025 0 019.543-2c1.275-1.275 2.943-2 9.543-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM7.076 16.337c-1.524-1.062-2.572-1.864-4-2.34v-2.932c0-1.476.372-2.885 1.012-3.972l-.003-.217c-.823.702-1.488 1.592-1.875 2.628-.388 1.036-.89 1.875-1.875 2.628 1.012 1.087 1.488 2.496 1.875 3.972l.003.217z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Password feedback */}
      {password && password.trim().length < MIN_PASSWORD_LENGTH && (
        <p className="mt-1 text-sm text-gray-500">
          Password must be at least {MIN_PASSWORD_LENGTH} characters
        </p>
      )}
      {password && password.trim().length >= MIN_PASSWORD_LENGTH && (
        <p className="mt-1 text-sm text-green-600">
          Password looks good!
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full py-3 active:scale-95 transition-transform duration-150"
        disabled={loading || password.trim().length < MIN_PASSWORD_LENGTH || !email.trim()}
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
    const checkSession = async () => {
      const currentUser = await auth.getCurrentUser();
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
        <div className="max-w-sm mx-auto px-4 py-12">
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
