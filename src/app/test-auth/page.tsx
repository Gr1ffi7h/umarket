"use client"

import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/Button';

export default function TestAuth() {
  const { user, loading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        {/* Public Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Public Section (Always Visible)</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Session:</strong> {user ? 'Active' : 'None'}</p>
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          </div>
        </div>

        {/* Protected Section */}
        {user ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Protected Section (Auth Required)</h2>
            <p className="mb-4">✅ You can only see this if you're logged in!</p>
            <Button onClick={handleLogout} variant="secondary">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Protected Section (Auth Required)</h2>
            <p className="mb-4">❌ Please sign in to see this content</p>
            <a href="/login" className="text-blue-600 hover:text-blue-800">Sign In</a>
          </div>
        )}

        {/* Auth Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="flex gap-4">
            <a href="/login" className="text-blue-600 hover:text-blue-800">Sign In</a>
            <a href="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</a>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</a>
            <a href="/browse" className="text-blue-600 hover:text-blue-800">Browse</a>
          </div>
        </div>
      </div>
    </div>
  );
}
