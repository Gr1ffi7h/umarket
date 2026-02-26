/**
 * Global Authentication Provider
 * 
 * Production-ready auth state management for Next.js + Supabase
 * Eliminates infinite loading, redirect loops, and race conditions
 */

'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

// Types
export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | string | null
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<{ error: AuthError | null }>
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
      console.log('AuthProvider: Initializing auth...')
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('AuthProvider: Error getting session:', error)
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
          user: null,
          session: null
        }))
        return
      }

      console.log('AuthProvider: Session loaded:', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        email: session?.user?.email 
      })

      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('AuthProvider: Unexpected error:', error)
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
    console.log('AuthProvider: Auth state changed:', { 
      event, 
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email 
    })

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
      console.log('AuthProvider: Signing out...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('AuthProvider: Error signing out:', error)
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
      console.error('AuthProvider: Unexpected error signing out:', error)
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to sign out'
      }))
    }
  }, [])

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Signing in...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      })

      if (error) {
        console.error('AuthProvider: Sign in error:', error)
        return { error }
      }

      console.log('AuthProvider: Sign in successful')
      return { error: null }
    } catch (error) {
      console.error('AuthProvider: Unexpected sign in error:', error)
      return { error: { message: 'Failed to sign in' } as AuthError }
    }
  }, [])

  // Sign up function
  const signUp = useCallback(async (email: string, password: string, metadata?: { name?: string }) => {
    try {
      console.log('AuthProvider: Signing up...')
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: metadata
        }
      })

      if (error) {
        console.error('AuthProvider: Sign up error:', error)
        return { error }
      }

      console.log('AuthProvider: Sign up successful')
      return { error: null }
    } catch (error) {
      console.error('AuthProvider: Unexpected sign up error:', error)
      return { error: { message: 'Failed to sign up' } as AuthError }
    }
  }, [])

  // Set up auth listeners on mount
  useEffect(() => {
    console.log('AuthProvider: Setting up auth provider...')
    
    // Initialize auth
    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    // Cleanup
    return () => {
      console.log('AuthProvider: Cleaning up auth subscription')
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
