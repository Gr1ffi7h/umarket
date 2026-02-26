/**
 * Root Layout Component
 * 
 * Main layout wrapper for UMarket application
 * Server component - optimized for performance and SEO
 * Updated with AppWrapper for dark mode support
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Navigation } from '@/components/Navigation-supabase';
import { MobileBottomNav } from '@/components/MobileBottomNav-supabase';
import { GlobalErrorLogger } from '@/components/GlobalErrorLogger';
import { AuthProvider } from '@/providers/AuthProvider';

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Metadata for SEO and social sharing
 */
export const metadata: Metadata = {
  title: {
    default: 'UMarket - College Student Marketplace',
    template: '%s | UMarket',
  },
  description: 'A secure marketplace exclusively for college students with .edu email verification',
  keywords: ['marketplace', 'college', 'students', 'campus', 'buy', 'sell'],
  authors: [{ name: 'UMarket Team' }],
  creator: 'UMarket',
  publisher: 'UMarket',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'UMarket - College Student Marketplace',
    description: 'A secure marketplace exclusively for college students',
    type: 'website',
    locale: 'en_US',
    siteName: 'UMarket',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UMarket - College Student Marketplace',
    description: 'A secure marketplace exclusively for college students',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

/**
 * Root layout component
 * Wraps all pages with consistent HTML structure and styling
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#2563eb" />
        
        {/* Viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden min-h-screen`}>
        <AuthProvider>
          <GlobalErrorLogger />
          <div className="flex flex-col min-h-screen">
            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Skip to main content
            </a>
            
            <Navigation />
            <main id="main-content" className="relative flex-1 pb-16 md:pb-0">
              {children}
            </main>
            
            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
            
            {/* Footer or global components can go here */}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
