/**
 * Admin Dashboard Component
 * 
 * Client-side admin interface with user, listing, and conversation management
 * Includes role management and content moderation capabilities
 * Uses localStorage for data persistence
 */

'use client';

import { useState } from 'react';

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

interface AdminDashboardProps {
  initialUsers: User[];
  initialListings: Listing[];
  initialConversations: Conversation[];
  currentUserId: string;
}

// Remove Supabase client initialization
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function AdminDashboard({ 
  initialUsers, 
  initialListings, 
  initialConversations, 
  currentUserId 
}: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'listings' | 'conversations'>('users');

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // localStorage-based admin functions
const handleBanUser = async (userId: string) => {
  if (userId === currentUserId) {
    showMessage('Cannot ban yourself', true);
    return;
  }

  setLoading(true);
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('umarket_users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === userId ? { ...u, role: 'banned' } : u
    );
    localStorage.setItem('umarket_users', JSON.stringify(updatedUsers));
    
    setUsers(users.map((u: User) => u.id === userId ? { ...u, role: 'banned' } : u));
    showMessage('User banned successfully');
  } catch (error) {
    showMessage('Error banning user', true);
  } finally {
    setLoading(false);
  }
};

  const handleUnbanUser = async (userId: string) => {
  setLoading(true);
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('umarket_users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === userId ? { ...u, role: 'user' } : u
    );
    localStorage.setItem('umarket_users', JSON.stringify(updatedUsers));
    
    setUsers(users.map((u: User) => u.id === userId ? { ...u, role: 'user' } : u));
    showMessage('User unbanned successfully');
  } catch (error) {
    showMessage('Error unbanning user', true);
  } finally {
    setLoading(false);
  }
};

  const handleDeleteListing = async (listingId: string) => {
  if (!confirm('Are you sure you want to delete this listing?')) {
    return;
  }

  setLoading(true);
  try {
    // Get listings from localStorage
    const listings = JSON.parse(localStorage.getItem('umarket_listings') || '[]');
    const updatedListings = listings.filter((l: Listing) => l.id !== listingId);
    localStorage.setItem('umarket_listings', JSON.stringify(updatedListings));
    
    setListings(listings.filter((l: Listing) => l.id !== listingId));
    showMessage('Listing deleted successfully');
  } catch (error) {
    showMessage('Error deleting listing', true);
  } finally {
    setLoading(false);
  }
};

  const handleDeleteConversation = async (conversationId: string) => {
  if (!confirm('Are you sure you want to delete this conversation and all its messages?')) {
    return;
  }

  setLoading(true);
  try {
    // Get conversations from localStorage
    const conversations = JSON.parse(localStorage.getItem('umarket_conversations') || '[]');
    const updatedConversations = conversations.filter((c: Conversation) => c.id !== conversationId);
    localStorage.setItem('umarket_conversations', JSON.stringify(updatedConversations));
    
    setConversations(conversations.filter((c: Conversation) => c.id !== conversationId));
    showMessage('Conversation deleted successfully');
  } catch (error) {
    showMessage('Error deleting conversation', true);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('Error') ? 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {['users', 'listings', 'conversations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} 
              {tab === 'users' && ` (${users.length})`}
              {tab === 'listings' && ` (${listings.length})`}
              {tab === 'conversations' && ` (${conversations.length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Users Section */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          user.role === 'banned' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.role === 'banned' ? (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                          >
                            Unban
                          </button>
                        ) : user.role !== 'admin' ? (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          >
                            Ban
                          </button>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Listings Section */}
      {activeTab === 'listings' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Listings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Posted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{listing.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{listing.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{listing.profiles?.full_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{listing.user_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${listing.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conversations Section */}
      {activeTab === 'conversations' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Conversations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Conversation ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {conversations.map((conversation) => (
                    <tr key={conversation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {conversation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {conversation.messages[0]?.count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(conversation.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteConversation(conversation.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
