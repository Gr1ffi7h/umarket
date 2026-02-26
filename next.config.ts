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

  // Avoid workspace-root inference issues on hosts with multiple lockfiles
  outputFileTracingRoot: process.cwd(),
    
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

  webpack: (config, { dev }) => {
    // Webpack filesystem cache can intermittently emit PackFileCacheStrategy warnings on some hosts.
    // Disabling it in production keeps CI/Vercel output clean and deterministic.
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
