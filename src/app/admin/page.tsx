/**
 * Admin Panel - Client Component
 * 
 * Admin interface for managing users, listings, and conversations
 * Uses localStorage for data persistence and session management
 */

'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/AdminDashboard';
import { auth } from '@/lib/auth';
import { AuthGuard } from '@/components/AuthGuard';

interface User {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  description: string;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
  };
}

interface Conversation {
  id: string;
  created_at: string;
  messages: { count: number }[];
}

function AdminPanelContent() {
  const [adminData, setAdminData] = useState<{
    users: User[];
    listings: Listing[];
    conversations: Conversation[];
    currentUserId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAdminData = () => {
      try {
        const currentUser = auth.getCurrentUser();
        
        if (!currentUser) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // For demo purposes, we'll consider the first user as admin
        // In a real app, you'd have a role field in the user object
        const users = JSON.parse(localStorage.getItem('umarket_users') || '[]');
        const isAdmin = users.length > 0 && users[0].id === currentUser.id;
        
        if (!isAdmin) {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }

        // Load data from localStorage
        const listings = JSON.parse(localStorage.getItem('umarket_listings') || '[]');
        const conversations = JSON.parse(localStorage.getItem('umarket_conversations') || '[]');

        setAdminData({
          users: users.map((u: any) => ({
            id: u.id,
            full_name: u.fullName,
            role: u.role || 'user',
            created_at: u.createdAt
          })),
          listings: listings.map((l: any) => ({
            id: l.id,
            title: l.title,
            price: l.price,
            description: l.description,
            user_id: l.userId,
            created_at: l.createdAt,
            profiles: {
              id: l.userId,
              full_name: l.sellerName || 'Unknown'
            }
          })),
          conversations: conversations.map((c: any) => ({
            id: c.id,
            created_at: c.createdAt,
            messages: [{ count: c.messageCount || 0 }]
          })),
          currentUserId: currentUser.id
        });
      } catch (err) {
        console.error('Admin data loading error:', err);
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">No Data Available</h1>
          <p className="text-gray-500">Unable to load admin dashboard data.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage users, listings, and conversations</p>
        </div>
        
        <AdminDashboard 
          initialUsers={adminData.users}
          initialListings={adminData.listings}
          initialConversations={adminData.conversations}
          currentUserId={adminData.currentUserId}
        />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPanelContent />
    </AuthGuard>
  );
}
