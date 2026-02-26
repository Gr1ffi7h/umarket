/**
 * Global Authentication Provider
 * 
 * Production-ready auth state management for Next.js + Supabase
 * Eliminates infinite loading, redirect loops, and race conditions
 */

'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabaseClient'

// Types
export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | string | null
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; session: Session | null }>
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<{ error: AuthError | null; session: Session | null }>
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider Props
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Global Auth Provider Component
 * 
 * Features:
 * - Stable session management
 * - No infinite loading states
 * - Proper cleanup
 * - Error handling
 * - Production ready
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  // Initialize auth on mount
  const initializeAuth = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        })
        return
      }

      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
          user: null,
          session: null
        }))
        return
      }

      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        error: null
      })
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to initialize authentication',
        user: null,
        session: null
      }))
    }
  }, [])

  // Handle auth state changes
  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    setAuthState({
      user: session?.user ?? null,
      session: session,
      loading: false,
      error: null
    })
  }, [])

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Supabase is not configured.'
        }))
        return
      }

      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          error: error.message
        }))
      } else {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: null
        })
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to sign out'
      }))
    }
  }, [])

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        return { error: { message: 'Supabase is not configured.' } as AuthError, session: null }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      })

      if (error) {
        return { error, session: null }
      }

      // Explicitly require a session before treating as success
      if (!data.session) {
        return {
          error: { message: 'Sign in did not return a session. Please verify your email or try again.' } as AuthError,
          session: null,
        }
      }

      // Eagerly update auth state; onAuthStateChange will also fire shortly after
      setAuthState({
        user: data.session.user ?? null,
        session: data.session,
        loading: false,
        error: null,
      })

      return { error: null, session: data.session }
    } catch (error) {
      return { error: { message: 'Failed to sign in' } as AuthError, session: null }
    }
  }, [])

  // Sign up function
  const signUp = useCallback(async (email: string, password: string, metadata?: { name?: string }) => {
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        return { error: { message: 'Supabase is not configured.' } as AuthError, session: null }
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: metadata
        }
      })

      if (error) {
        return { error, session: null }
      }

      return { error: null, session: data.session ?? null }
    } catch (error) {
      return { error: { message: 'Failed to sign up' } as AuthError, session: null }
    }
  }, [])

  // Set up auth listeners on mount
  useEffect(() => {
    // Initialize auth
    initializeAuth()

    // Listen for auth state changes
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    // Cleanup
    return () => {
      subscription.unsubscribe()
    }
  }, [initializeAuth, handleAuthStateChange])

  // Context value
  const value: AuthContextType = {
    ...authState,
    signOut,
    signIn,
    signUp
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth Hook
 * 
 * Provides access to auth state and functions
 * Throws error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Auth State Helpers
 * 
 * Utility functions for checking auth state
 */
export const authHelpers = {
  isAuthenticated: (authState: AuthState) => !!authState.user && !authState.loading,
  isLoading: (authState: AuthState) => authState.loading,
  hasError: (authState: AuthState) => !!authState.error,
  getUserEmail: (authState: AuthState) => authState.user?.email,
  getUserId: (authState: AuthState) => authState.user?.id
}
