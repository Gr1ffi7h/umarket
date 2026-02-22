/**
 * Minimal Button Component
 * 
 * Clean, compact button design with minimal styling
 * Supports multiple variants and sizes with consistent spacing
 * Optimized for fast, lightweight UI
 */

"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
}

/**
 * Minimal Button Component
 * 
 * Provides clean, lightweight button styling with reduced visual bulk
 * Uses subtle borders and minimal padding for compact design
 */
export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  href,
  ...props
}: ButtonProps & { href?: string }) {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded
    transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${loading ? 'cursor-wait' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 focus:ring-primary-500
      border border-primary-600
      shadow-sm
    `,
    secondary: `
      bg-surface-light text-text-primary-light dark:bg-surface-dark dark:text-text-primary-dark
      hover:bg-gray-100 dark:hover:bg-primary-800 focus:ring-primary-500
      border border-gray-200 dark:border-primary-700
    `,
    outline: `
      bg-transparent text-text-primary-light dark:text-text-primary-dark
      hover:bg-gray-50 dark:hover:bg-primary-900 focus:ring-primary-500
      border border-gray-300 dark:border-primary-600
    `,
    ghost: `
      bg-transparent text-text-secondary-light dark:text-text-secondary-dark
      hover:bg-gray-100 dark:hover:bg-primary-800 hover:text-text-primary-light dark:hover:text-text-primary-dark focus:ring-primary-500
      border border-transparent
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const buttonContent = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12h4zm2 5.291A7.962 7.962 0 014 12h4z" />
        </svg>
      )}
      {children}
    </>
  );

  const MotionButton = motion.button;
  const MotionLink = motion(Link);

  const buttonProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15, ease: "easeOut" }
  } as any;

  if (href) {
    return (
      <MotionLink
        href={href}
        className={classes}
        onClick={onClick}
        {...buttonProps}
        {...props}
      >
        {buttonContent}
      </MotionLink>
    );
  }

  return (
    <MotionButton
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...buttonProps}
      {...props}
    >
      {buttonContent}
    </MotionButton>
  );
}
