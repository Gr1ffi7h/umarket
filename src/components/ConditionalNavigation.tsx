/**
 * Conditional Navigation Component
 * 
 * Renders Navigation only on non-landing pages
 * Landing page ("/") gets clean marketing experience
 * All other routes show full app navigation
 */

'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/Navigation-supabase'
import { MobileBottomNav } from '@/components/MobileBottomNav-supabase'

interface ConditionalNavigationProps {
  children: React.ReactNode
}

export function ConditionalNavigation({ children }: ConditionalNavigationProps) {
  const pathname = usePathname()

  // Don't render navigation on landing page
  const isLandingPage = pathname === '/'

  return (
    <div className="flex flex-col min-h-screen">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>
      
      {/* Conditionally render navigation */}
      {!isLandingPage && <Navigation />}
      
      <main id="main-content" className={`relative flex-1 ${isLandingPage ? '' : 'pb-16 md:pb-0'}`}>
        {children}
      </main>
      
      {/* Mobile Bottom Navigation - only on non-landing pages */}
      {!isLandingPage && <MobileBottomNav />}
    </div>
  )
}
