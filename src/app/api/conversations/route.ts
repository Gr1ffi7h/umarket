/**
 * Conversations API Route
 * 
 * Handles conversation creation and retrieval
 * Serverless compatible with Vercel deployment
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/supabase';

/**
 * GET /api/conversations
 * 
 * Returns all conversations for the authenticated user
 * Includes listing and participant details
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

    // Get current authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's conversations
    const { data: conversations, error } = await supabaseAdmin
      .from('conversations')
      .select(`
        *,
        listing: listings(id, title, price, image),
        buyer: users!buyer_id(id, username, avatar_url),
        seller: users!seller_id(id, username, avatar_url)
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversations: conversations || [] });
  } catch (error) {
    console.error('Conversations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * 
 * Creates a new conversation between buyer and seller for a listing
 * Returns existing conversation if one already exists
 */
export async function POST(request: NextRequest) {
  try {
    // Defensive check for Supabase admin client
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase configuration error' },
        { status: 500 }
      );
    }

    // Get current authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId, sellerId } = body;

    // Validate required fields
    if (!listingId || !sellerId) {
      return NextResponse.json(
        { error: 'Missing required fields: listingId, sellerId' },
        { status: 400 }
      );
    }

    // Prevent user from creating conversation with themselves
    if (user.id === sellerId) {
      return NextResponse.json(
        { error: 'Cannot create conversation with yourself' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const { data: existingConversation, error: fetchError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('listing_id', listingId)
      .eq('buyer_id', user.id)
      .eq('seller_id', sellerId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing conversation:', fetchError);
      return NextResponse.json(
        { error: 'Failed to check existing conversation' },
        { status: 500 }
      );
    }

    // Return existing conversation if found
    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation });
    }

    // Create new conversation
    const { data: newConversation, error: createError } = await supabaseAdmin
      .from('conversations')
      .insert({
        listing_id: listingId,
        buyer_id: user.id,
        seller_id: sellerId,
      })
      .select(`
        *,
        listing: listings(id, title, price, image),
        buyer: users!buyer_id(id, username, avatar_url),
        seller: users!seller_id(id, username, avatar_url)
      `)
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation: newConversation! });
  } catch (error) {
    console.error('Conversations POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
