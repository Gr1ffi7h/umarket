/**
 * Global Error Logger Component
 * 
 * Captures and logs all client-side errors for debugging
 * Helps identify production crashes
 */

"use client";

import { useEffect } from "react";

export function GlobalErrorLogger() {
  useEffect(() => {
    // Global error handler
    window.onerror = function (message, source, lineno, colno, error) {
      console.error("Global Error:", {
        message,
        source,
        lineno,
        colno,
        error: error?.stack || error
      });
      
      // Also log to console for easier debugging
      console.error("Error details:", {
        message: message,
        source: source,
        line: lineno,
        column: colno,
        error: error
      });
    };

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error("Unhandled Promise Rejection:", event.reason);
    });

    return () => {
      window.onerror = null;
    };
  }, []);

  return null;
}
