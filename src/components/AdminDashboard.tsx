/**
 * Simple Admin Dashboard Component
 * 
 * Basic admin interface without localStorage dependencies
 * Shows admin info and basic stats
 */

'use client';

import React, { useState, useEffect } from 'react';

interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalConversations: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalListings: 0,
    totalConversations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 0,
        totalListings: 0,
        totalConversations: 0
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Users</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalUsers}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Total registered users</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Listings</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalListings}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Active marketplace listings</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Conversations</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalConversations}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Active conversations</p>
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Admin Panel</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Admin Features</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• User management and moderation</li>
              <li>• Listing content moderation</li>
              <li>• Conversation monitoring</li>
              <li>• System analytics</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Coming Soon</h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
              <li>• Real-time user activity monitoring</li>
              <li>• Advanced analytics dashboard</li>
              <li>• Bulk content management</li>
              <li>• Automated moderation tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
