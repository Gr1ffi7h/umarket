"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null, 
  loading: true 
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const getInitialSession = useCallback(async () => {
    try {
      console.log('AuthContext: Getting initial session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('AuthContext: Error getting session:', error)
        setSession(null)
        setUser(null)
      } else {
        console.log('AuthContext: Session loaded:', { 
          hasSession: !!session, 
          userId: session?.user?.id,
          email: session?.user?.email 
        })
        setSession(session)
        setUser(session?.user ?? null)
      }
    } catch (error) {
      console.error('AuthContext: Unexpected error:', error)
      setSession(null)
      setUser(null)
    } finally {
      console.log('AuthContext: Setting loading to false')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log('AuthContext: Setting up auth listeners...')
    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed:', { 
          event, 
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email 
        })
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      console.log('AuthContext: Cleaning up subscription')
      subscription.unsubscribe()
    }
  }, [getInitialSession])

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
