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
    const handleUnhandled = (event: PromiseRejectionEvent) => {
      console.error("Unhandled Promise Rejection:", event.reason);
    };

    window.addEventListener('unhandledrejection', handleUnhandled);

    return () => {
      window.onerror = null;
      window.removeEventListener('unhandledrejection', handleUnhandled);
    };
  }, []);

  return null;
}
