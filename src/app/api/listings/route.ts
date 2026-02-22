/**
 * Listings API Route
 * 
 * Handles listing retrieval with filtering
 * Serverless compatible with Vercel deployment
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/listings
 * 
 * Returns all active listings with optional filtering
 * Supports category and condition filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Defensive check for Supabase admin client
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase configuration error' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const condition = url.searchParams.get('condition');
    
    let query = supabaseAdmin
      .from('listings')
      .select(`
        id,
        title,
        price,
        category,
        condition,
        image,
        description,
        posted_at,
        user_id,
        status
      `)
      .eq('status', 'active')
      .order('posted_at', { ascending: false });

    // Apply filters if provided
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    if (condition && condition !== 'All') {
      query = query.eq('condition', condition);
    }

    const { data: listings, error } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ listings: listings || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
