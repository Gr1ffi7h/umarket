/**
 * Listings Service for Supabase
 * 
 * Handles all listing operations with Supabase database
 * Real-time subscriptions for cross-device sync
 */

import { supabase } from './supabaseClient';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'sold' | 'removed';
  profiles?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

export class ListingsService {
  // Get all active listings with pagination
  static async getListings(page = 1, limit = 20, category?: string): Promise<{
    listings: Listing[];
    hasMore: boolean;
    totalCount: number;
  }> {
    let query = supabase!
      .from('listings')
      .select('*, profiles(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    const totalCount = count || 0;
    const hasMore = page * limit < totalCount;

    return {
      listings: data || [],
      hasMore,
      totalCount
    };
  }

  // Get featured listings (random selection updated hourly)
  static async getFeaturedListings(): Promise<Listing[]> {
    const { data, error } = await supabase!
      .from('listings')
      .select('*, profiles(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    const featured: Listing[] = (data as any) || [];
    return featured;
  }

  // Get single listing by ID
  static async getListing(id: string): Promise<Listing | null> {
    const { data, error } = await supabase!
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get user's listings
  static async getUserListings(userId: string): Promise<Listing[]> {
    const { data, error } = await supabase!
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Create new listing
  static async createListing(listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>): Promise<Listing> {
    const listingData = {
      ...listing,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase!
      .from('listings')
      .insert(listingData as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update listing
  static async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase!
      .from('listings')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete listing
  static async deleteListing(id: string): Promise<void> {
    const { data, error } = await supabase!
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Search listings
  static async searchListings(query: string, page = 1, limit = 20): Promise<{
    listings: Listing[];
    hasMore: boolean;
    totalCount: number;
  }> {
    const { data, error, count } = await supabase!
      .from('listings')
      .select('*, profiles(*)')
      .ilike('title', `%${query}%`)
      .or(`description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    const totalCount = count || 0;
    const hasMore = page * limit < totalCount;

    return {
      listings: data || [],
      hasMore,
      totalCount
    };
  }

  // Get categories
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase!
      .from('listings')
      .select('category')
      .eq('status', 'active');

    if (error) throw error;

    const categories = [...new Set((data as any)?.map((item: any) => item.category).filter(Boolean))] as string[];
    return categories.sort();
  }

  // Subscribe to real-time listing updates
  static subscribeToListings(callback: (payload: any) => void) {
    return supabase!
      .channel('public:listings')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'listings' },
        (payload) => callback(payload)
      )
      .subscribe();
  }
}
