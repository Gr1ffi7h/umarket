/**
 * Health Check API Route
 * 
 * Simple health check endpoint for monitoring and load balancers
 */

import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * 
 * Health check endpoint
 */
export async function GET() {
  try {
    return NextResponse.json(
      { status: 'healthy', timestamp: new Date().toISOString() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch {
    return NextResponse.json({ status: 'unhealthy' }, { status: 500 });
  }
}
