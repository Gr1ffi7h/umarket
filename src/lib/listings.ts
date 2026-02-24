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
    try {
      console.log('ListingsService: Getting listings...', { page, limit, category })
      
      let query = supabase
        .from('listings')
        .select('*, profiles(*)', { count: 'exact' })
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        console.error('ListingsService: Error getting listings:', error)
        throw error;
      }

      const totalCount = count || 0;
      const hasMore = totalCount > page * limit;

      console.log('ListingsService: Listings loaded:', data?.length || 0, 'Total:', totalCount)

      return {
        listings: data || [],
        hasMore,
        totalCount
      };
    } catch (error) {
      console.error('ListingsService: Unexpected error:', error)
      throw error;
    }
  }

  // Get featured listings
  static async getFeaturedListings(): Promise<Listing[]> {
    try {
      console.log('ListingsService: Getting featured listings...')
      
      const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('ListingsService: Error getting featured listings:', error)
        throw error;
      }

      console.log('ListingsService: Featured listings loaded:', data?.length || 0)
      return data || [];
    } catch (error) {
      console.error('ListingsService: Unexpected error getting featured listings:', error)
      throw error;
    }
  }

  // Get single listing by ID
  static async getListing(id: string): Promise<Listing | null> {
    try {
      console.log('ListingsService: Getting listing:', id)
      
      const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('ListingsService: Error getting listing:', error)
        return null;
      }

      console.log('ListingsService: Listing loaded:', data ? 'Success' : 'Not found')
      return data;
    } catch (error) {
      console.error('ListingsService: Unexpected error getting listing:', error)
      return null;
    }
  }

  // Get listings for a specific user
  static async getUserListings(userId: string): Promise<Listing[]> {
    try {
      console.log('ListingsService: Getting user listings:', userId)
      
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('ListingsService: Error getting user listings:', error)
        throw error;
      }

      console.log('ListingsService: User listings loaded:', data?.length || 0)
      return data || [];
    } catch (error) {
      console.error('ListingsService: Unexpected error getting user listings:', error)
      throw error;
    }
  }

  // Create new listing
  static async createListing(listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>): Promise<Listing> {
    try {
      console.log('ListingsService: Creating listing:', listing.title)
      
      const { data, error } = await supabase
        .from('listings')
        .insert(listing as any)
        .select()
        .single();

      if (error) {
        console.error('ListingsService: Error creating listing:', error)
        throw error;
      }

      console.log('ListingsService: Listing created successfully')
      return data;
    } catch (error) {
      console.error('ListingsService: Unexpected error creating listing:', error)
      throw error;
    }
  }

  // Update listing
  static async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    try {
      console.log('ListingsService: Updating listing:', id)
      
      const { data, error } = await supabase
        .from('listings')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('ListingsService: Error updating listing:', error)
        throw error;
      }

      console.log('ListingsService: Listing updated successfully')
      return data;
    } catch (error) {
      console.error('ListingsService: Unexpected error updating listing:', error)
      throw error;
    }
  }

  // Delete listing
  static async deleteListing(id: string): Promise<void> {
    try {
      console.log('ListingsService: Deleting listing:', id)
      
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('ListingsService: Error deleting listing:', error)
        throw error;
      }

      console.log('ListingsService: Listing deleted successfully')
    } catch (error) {
      console.error('ListingsService: Unexpected error deleting listing:', error)
      throw error;
    }
  }

  // Search listings
  static async searchListings(query: string, page = 1, limit = 20): Promise<{
    listings: Listing[];
    hasMore: boolean;
    totalCount: number;
  }> {
    try {
      console.log('ListingsService: Searching listings:', { query, page, limit })
      
      const { data, error, count } = await supabase
        .from('listings')
        .select('*, profiles(*)', { count: 'exact' })
        .eq('status', 'active')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        console.error('ListingsService: Error searching listings:', error)
        throw error;
      }

      const totalCount = count || 0;
      const hasMore = totalCount > page * limit;

      console.log('ListingsService: Search results:', data?.length || 0, 'Total:', totalCount)

      return {
        listings: data || [],
        hasMore,
        totalCount
      };
    } catch (error) {
      console.error('ListingsService: Unexpected error searching listings:', error)
      throw error;
    }
  }

  // Get all categories
  static async getCategories(): Promise<string[]> {
    try {
      console.log('ListingsService: Getting categories...')
      
      const { data, error } = await supabase
        .from('listings')
        .select('category')
        .eq('status', 'active');

      if (error) {
        console.error('ListingsService: Error getting categories:', error)
        throw error;
      }

      const categories = [...new Set(data?.map(item => item.category) || [])];
      console.log('ListingsService: Categories loaded:', categories.length)
      return categories;
    } catch (error) {
      console.error('ListingsService: Unexpected error getting categories:', error)
      throw error;
    }
  }

  // Subscribe to real-time updates
  static subscribeToListings(callback: (listing: Listing) => void) {
    console.log('ListingsService: Setting up real-time subscription')
    
    const subscription = supabase
      .channel('listings')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'listings' 
        }, 
        (payload) => {
          console.log('ListingsService: Real-time update:', payload)
          if (payload.new) {
            callback(payload.new as Listing);
          }
        }
      )
      .subscribe();

    return subscription;
  }
}
