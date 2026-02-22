/**
 * Sign Up Page Component
 * 
 * Registration page with .edu email validation
 * Client-side form validation and error handling
 * Responsive design with accessibility features
 * Uses dynamic rendering to avoid SSR issues with theme context
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { auth } from '@/lib/auth-supabase';

// Password validation constants
const MIN_PASSWORD_LENGTH = 8; // Match Supabase minimum

/**
 * Form validation for .edu email addresses
 */
function isValidEduEmail(email: string): boolean {
  const eduRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/;
  return eduRegex.test(email.toLowerCase());
}

/**
 * Sign Up Page Component
 * 
 * Provides user registration form with .edu email validation
 * Includes form validation, error handling, and accessibility features
 */
export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEduEmail(formData.email)) {
      newErrors.email = 'Must be a valid .edu email address';
    }

    // Password validation
    const passwordTrimmed = formData.password.trim();
    if (!passwordTrimmed) {
      newErrors.password = 'Password is required';
    } else if (passwordTrimmed.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordTrimmed !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const emailTrimmed = formData.email.trim();
      const passwordTrimmed = formData.password.trim();
      const result = await auth.signUp(emailTrimmed, passwordTrimmed, formData.name);
      
      if (result.success) {
        // Redirect to login page on successful signup
        if (typeof window !== 'undefined') {
          window.location.href = '/login?message=signup-success';
        }
      } else {
        // Override any 6-character error messages with our 8-character requirement
        let errorMessage = result.error || 'Registration failed. Please try again.';
        if (errorMessage.includes('6 characters')) {
          errorMessage = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
        }
        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join the university marketplace
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 active:scale-95 transition-transform duration-150"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 active:scale-95 transition-transform duration-150"
                placeholder="your.email@university.edu"
                value={formData.email}
                onChange={handleInputChange}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be a valid .edu email address
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 active:scale-95 transition-transform duration-150"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-describedby={errors.password ? 'password-error' : undefined}
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
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
              {formData.password && !errors.password && (
                <p className="mt-1 text-sm text-green-600">
                  Password looks good!
                </p>
              )}
              {formData.password && formData.password.length < MIN_PASSWORD_LENGTH && !errors.password && (
                <p className="mt-1 text-sm text-gray-500">
                  Password must be at least {MIN_PASSWORD_LENGTH} characters
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 active:scale-95 transition-transform duration-150"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <p className="text-sm text-red-800 dark:text-red-200" role="alert">
                  {errors.submit}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting || formData.password.trim().length < MIN_PASSWORD_LENGTH || !formData.email.trim() || !formData.name.trim() || !formData.confirmPassword}
              className="w-full py-3 active:scale-95 transition-transform duration-150"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
