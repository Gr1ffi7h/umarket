/**
 * Supabase Authentication Utilities
 * 
 * Uses Supabase for user authentication and session management
 * Supports user registration, login, and real-time session updates
 */

import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export const auth = {
  // Get current session
  getCurrentSession: async (): Promise<Session | null> => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session error:', error);
      return null;
    }
    return session;
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const session = await auth.getCurrentSession();
    if (!session?.user) {
      return null;
    }

    // Get user profile from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      return {
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        createdAt: profile.created_at
      };
    }

    // If no profile exists, create one
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: session.user.id,
        email: session.user.email!,
        full_name: session.user.user_metadata?.full_name || '',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    return newProfile ? {
      id: newProfile.id,
      fullName: newProfile.full_name,
      email: newProfile.email,
      createdAt: newProfile.created_at
    } : null;
  },

  // Sign up new user
  signUp: async (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Signup attempt:', { fullName, email, password: '***' });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        return { success: false, error: 'Please check your email to verify your account' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      // Handle network/fetch errors
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        return { success: false, error: 'Failed to fetch. Check your Supabase URL and anon key.' };
      }
      return { success: false, error: 'Registration failed' };
    }
  },

  // Sign in user
  signIn: async (email: string, password: string): Promise<AuthUser | null> => {
    try {
      console.log('Login attempt:', { email, password: '***' });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return null;
      }

      if (data.user) {
        const user = await auth.getCurrentUser();
        return user;
      }

      return null;
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle network/fetch errors
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        console.error('Network error detected - check Supabase configuration');
      }
      return null;
    }
  },

  // Sign out user
  signOut: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const session = await auth.getCurrentSession();
    return session !== null;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        const user = await auth.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
};
