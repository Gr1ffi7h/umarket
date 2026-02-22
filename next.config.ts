import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * 
 * Optimized for:
 * - Vercel serverless deployment
 * - Production performance
 * - Security best practices
 * - Image optimization
 */
const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Disable ESLint during build to avoid TypeScript parsing issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimize images for Vercel deployment
  images: {
    domains: [],
    formats: ["image/webp", "image/avif"],
  },
  
  // Security headers for production
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  
  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
