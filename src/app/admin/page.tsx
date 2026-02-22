/**
 * Admin Panel - Secure Admin Interface
 * 
 * Only accessible by designated admin account
 * Full management capabilities for users, listings, and conversations
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedPage } from '@/components/ProtectedPage';
import { supabase } from '@/lib/supabaseClient';

// Prevent static generation during build
export const dynamic = "force-dynamic";

interface User {
  id: string;
  full_name: string;
  email: string;
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
    email: string;
  };
}

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  last_message_at: string;
}

function AdminPanelContent() {
  const [adminData, setAdminData] = useState<{
    users: User[];
    listings: Listing[];
    conversations: Conversation[];
  }>({
    users: [],
    listings: [],
    conversations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      // Check if user is the designated admin
      const isAdmin = user.email === 'Admin@uni.edu' && user.user_metadata?.name === 'Admin';
      
      if (!isAdmin) {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      try {
        // Fetch admin data
        const [usersData, listingsData, conversationsData] = await Promise.all([
          supabase!.from('profiles').select('*').order('created_at', { ascending: true }),
          supabase!.from('listings').select('*, profiles(*)').order('created_at', { ascending: false }),
          supabase!.from('conversations').select('*').order('created_at', { ascending: false })
        ]);

        setAdminData({
          users: usersData.data?.map((u: any) => ({
            id: u.id,
            full_name: u.full_name,
            email: u.email,
            role: u.role || 'user',
            created_at: u.created_at
          })) || [],
          listings: listingsData.data || [],
          conversations: conversationsData.data || []
        });
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await supabase!.from('profiles').delete().eq('id', userId);
      setAdminData(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== userId)
      }));
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await supabase!.from('listings').delete().eq('id', listingId);
      setAdminData(prev => ({
        ...prev,
        listings: prev.listings.filter(l => l.id !== listingId)
      }));
    } catch (error) {
      setError('Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Users ({adminData.users.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {adminData.users.map((user) => (
                <div key={user.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-400">Role: {user.role}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Listings Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Listings ({adminData.listings.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {adminData.listings.map((listing) => (
                <div key={listing.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{listing.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${listing.price} by {listing.profiles?.full_name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversations Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Conversations ({adminData.conversations.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {adminData.conversations.map((conversation) => (
                <div key={conversation.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Conversation {conversation.id}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Between: {conversation.participant1_id} & {conversation.participant2_id}
                    </p>
                    <p className="text-xs text-gray-400">
                      Last message: {new Date(conversation.last_message_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedPage>
      <AdminPanelContent />
    </ProtectedPage>
  );
}
