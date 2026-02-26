/**
 * Theme Provider Component
 * 
 * Provides light/dark mode functionality with localStorage persistence
 * Detects system preference and allows manual toggle
 * Server-safe implementation with proper hydration
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  systemTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Get system theme preference
 */
function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get stored theme from localStorage
 */
function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('umarket_theme');
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Store theme in localStorage
 */
function storeTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('umarket_theme', theme);
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Theme Provider Component
 * 
 * Manages theme state and provides theme context to the application
 * Handles system preference detection and localStorage persistence
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [systemTheme, setSystemTheme] = useState<Theme>('light');

  // Initialize theme on mount
  useEffect(() => {
    setSystemTheme(getSystemTheme());
    
    const stored = getStoredTheme();
    if (stored) {
      setTheme(stored);
    } else {
      const system = getSystemTheme();
      setTheme(system);
      storeTheme(system);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // Only update theme if user hasn't manually set a preference
      const stored = getStoredTheme();
      if (!stored) {
        setTheme(newSystemTheme);
        storeTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storeTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
