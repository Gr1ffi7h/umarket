/**
 * Listings Service for Supabase
 * 
 * Handles all listing operations with Supabase database
 * Real-time subscriptions for cross-device sync
 */

import { supabase } from './supabase';
import { auth } from './auth-supabase';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  user_id: string;
  seller_name: string;
  created_at: string;
  status: string;
  image?: string;
}

export const listingsService = {
  // Get all listings
  getListings: async (): Promise<Listing[]> => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching listings:', error);
      return [];
    }
  },

  // Get listings by user
  getUserListings: async (userId: string): Promise<Listing[]> => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user listings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user listings:', error);
      return [];
    }
  },

  // Create new listing
  createListing: async (listing: Omit<Listing, 'id' | 'created_at' | 'seller_name'>): Promise<Listing | null> => {
    try {
      const user = await auth.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listing,
          seller_name: user.fullName,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating listing:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating listing:', error);
      return null;
    }
  },

  // Update listing
  updateListing: async (id: string, updates: Partial<Listing>): Promise<Listing | null> => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating listing:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating listing:', error);
      return null;
    }
  },

  // Delete listing
  deleteListing: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting listing:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting listing:', error);
      return false;
    }
  },

  // Subscribe to real-time listings updates
  subscribeToListings: (callback: (listing: Listing) => void) => {
    const subscription = supabase
      .channel('listings')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'listings' 
        },
        (payload: any) => {
          callback(payload.new as Listing);
        }
      )
      .subscribe();

    return subscription;
  },

  // Subscribe to user's listings updates
  subscribeToUserListings: (userId: string, callback: (listing: Listing) => void) => {
    const subscription = supabase
      .channel(`user_listings_${userId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'listings',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            callback(payload.new as Listing);
          }
        }
      )
      .subscribe();

    return subscription;
  }
};
