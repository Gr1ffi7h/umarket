/**
 * Admin Panel - Server Component
 * 
 * Secure admin interface for managing users, listings, and conversations
 * Protected by middleware and server-side role verification
 */

// Force dynamic rendering to prevent build crashes from Supabase
export const dynamic = "force-dynamic";

import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { AdminDashboard } from '@/components/AdminDashboard';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getAdminData() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    redirect('/login');
  }

  // Verify admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    redirect('/');
  }

  // Get all users
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (usersError) {
    console.error('Error fetching users:', usersError);
  }

  // Get all listings
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (listingsError) {
    console.error('Error fetching listings:', listingsError);
  }

  // Get all conversations
  const { data: conversations, error: conversationsError } = await supabase
    .from('conversations')
    .select('*')
    .order('created_at', { ascending: false });

  if (conversationsError) {
    console.error('Error fetching conversations:', conversationsError);
  }

  return {
    users: users || [],
    listings: listings || [],
    conversations: conversations || [],
    currentUserId: session.user.id
  };
}

export default async function AdminPage() {
  try {
    const adminData = await getAdminData();
    
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
  } catch (error) {
    console.error('Admin page error:', error);
    redirect('/');
  }
}
