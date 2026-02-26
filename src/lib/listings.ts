/**
 * Listings Service for Supabase
 * 
 * Handles all listing operations with Supabase database
 * Real-time subscriptions for cross-device sync
 */

import { getSupabaseBrowserClient } from './supabaseClient';

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
    username: string;
    email: string;
    avatar_url?: string;
    role: string;
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
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return { listings: [], hasMore: false, totalCount: 0 };
      }
      
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

      return {
        listings: data || [],
        hasMore,
        totalCount
      };
    } catch (error) {
      throw error;
    }
  }

  // Get featured listings
  static async getFeaturedListings(): Promise<Listing[]> {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  }

  // Get single listing by ID
  static async getListing(id: string): Promise<Listing | null> {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return null;
      
      const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  // Get listings for a specific user
  static async getUserListings(userId: string): Promise<Listing[]> {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  }

  // Create new listing
  static async createListing(listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>): Promise<Listing> {
    try {
      console.log('ListingsService: Creating listing with data:', {
        title: listing.title,
        price: listing.price,
        category: listing.category,
        condition: listing.condition,
        user_id: listing.user_id,
        images_count: listing.images?.length || 0,
        status: listing.status
      });

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        console.error('ListingsService: Supabase client not available');
        throw new Error('Supabase is not configured.');
      }
      
      const { data, error } = await supabase
        .from('listings')
        .insert(listing as any)
        .select()
        .single();

      if (error) {
        console.error('ListingsService: Error creating listing:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Failed to create listing: ${error.message}`);
      }

      console.log('ListingsService: Listing created successfully:', data?.id);
      return data;
    } catch (error) {
      console.error('ListingsService: Unexpected error in createListing:', error);
      throw error;
    }
  }

  // Update listing
  static async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error('Supabase is not configured.');
      
      const { data, error } = await supabase
        .from('listings')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Delete listing
  static async deleteListing(id: string): Promise<void> {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error('Supabase is not configured.');
      
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
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
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return { listings: [], hasMore: false, totalCount: 0 };
      }
      
      const { data, error, count } = await supabase
        .from('listings')
        .select('*, profiles(*)', { count: 'exact' })
        .eq('status', 'active')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        throw error;
      }

      const totalCount = count || 0;
      const hasMore = totalCount > page * limit;

      return {
        listings: data || [],
        hasMore,
        totalCount
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all categories
  static async getCategories(): Promise<string[]> {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('listings')
        .select('category')
        .eq('status', 'active');

      if (error) {
        throw error;
      }

      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories;
    } catch (error) {
      throw error;
    }
  }

  // Subscribe to real-time updates
  static subscribeToListings(callback: (listing: Listing) => void) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;
    
    const subscription = supabase
      .channel('listings')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'listings' 
        }, 
        (payload) => {
          if (payload.new) {
            callback(payload.new as Listing);
          }
        }
      )
      .subscribe();

    return subscription;
  }
}
