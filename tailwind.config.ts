import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Configuration
 * 
 * Modern color palette for UMarket
 * Navy Blue, Green, Yellow, Aqua, Pink, Mint
 * Optimized for production and Vercel deployment
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern color palette for UMarket
        navy: {
          50: '#f0f4f8',
          100: '#e0e7ef',
          200: '#c2d1e0',
          300: '#a3b5cc',
          400: '#7189b4',
          500: '#1e3a8a', // Navy Blue
          600: '#1e40af',
          700: '#1d4ed8',
          800: '#2563eb',
          900: '#1e40af',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308', // Yellow
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        aqua: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Aqua
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // Pink
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        mint: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Mint
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Semantic aliases
        primary: {
          50: '#f0f4f8',
          100: '#e0e7ef',
          200: '#c2d1e0',
          300: '#a3b5cc',
          400: '#7189b4',
          500: '#4a5f8a',
          600: '#1e40af',
          700: '#1d4ed8',
          800: '#2563eb',
          900: '#1e40af',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
