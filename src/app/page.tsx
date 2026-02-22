/**
 * Modern Minimal Landing Page
 * 
 * Clean, attractive design for college students
 * Optimized for mobile and performance
 * Navy Blue, Green, Yellow, Aqua, Pink, Mint color scheme
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export const dynamic = "force-dynamic";

function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-aqua-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            UMarket
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your Campus Marketplace
            <br />
            <span className="text-green-400 font-semibold">Buy. Sell. Connect.</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/browse">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg">
              Browse Items
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">2K+</div>
            <div className="text-sm text-blue-100">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">1K+</div>
            <div className="text-sm text-blue-100">Items Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400">98%</div>
            <div className="text-sm text-blue-100">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: "🎓",
      title: "Student Only",
      description: "Verified .edu email addresses ensure a trusted community",
      color: "text-blue-400"
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Optimized for phones with instant notifications",
      color: "text-green-400"
    },
    {
      icon: "⚡",
      title: "Real-time",
      description: "Live messaging and instant updates",
      color: "text-yellow-400"
    },
    {
      icon: "🔒",
      title: "Secure",
      description: "Safe transactions and profile verification",
      color: "text-pink-400"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Why Choose UMarket?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center group transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-5xl mb-4 group-hover:animate-bounce">{feature.icon}</div>
              <h3 className={`text-xl font-bold mb-3 ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-aqua-600">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
          Join students already buying and selling on campus
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Link href="/browse">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold">
                  Create Listing
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
