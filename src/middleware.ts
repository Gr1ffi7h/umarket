/**
 * Middleware for Authentication and Route Protection
 * 
 * Handles protected routes and admin access
 * Redirects unauthenticated users to login
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/browse',
  '/create-listing',
  '/messages',
  '/profile',
  '/my-listings',
  '/profile/edit'
];

// Routes that require admin role
const adminRoutes = [
  '/admin'
];

// Routes that should be accessible without authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // For now, allow all routes (temporary local auth)
  // TODO: Implement proper authentication when database is ready
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
