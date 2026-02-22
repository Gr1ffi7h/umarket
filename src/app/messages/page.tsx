/**
 * Messages Page Component
 * 
 * Main messaging interface with conversation list and chat
 * Real-time updates with cross-device synchronization
 * Mobile-first responsive design
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ClientHeader } from '@/components/ClientHeader';
import { ConversationList } from '@/components/ConversationList';
import { ChatInterface } from '@/components/ChatInterface';
import { auth } from '@/lib/auth-supabase';

// Prevent static generation during build
export const dynamic = "force-dynamic";

export default function MessagesPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const conversationId = params.conversationId as string;

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();

    // Listen to auth state changes
    const { data: authListener } = auth.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [conversationId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <ClientHeader />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <ClientHeader />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              You don&apos;t have permission to view this conversation.
            </p>
            <button
              onClick={() => router.push('/messages')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Messages
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show chat interface if conversation ID is provided
  if (conversationId && conversation) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <ClientHeader />
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
          {/* Mobile: Full screen chat */}
          <div className="flex-1 md:hidden">
            <ChatInterface
              conversationId={conversationId}
              currentUserId={user.id}
              conversation={conversation}
            />
          </div>
          
          {/* Desktop: Two-column layout */}
          <div className="hidden md:flex md:flex-1">
            <ChatInterface
              conversationId={conversationId}
              currentUserId={user.id}
              conversation={conversation}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show conversation list if no specific conversation
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ClientHeader />
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Mobile: Full screen conversation list */}
        <div className="flex-1 md:hidden">
          <ConversationList userId={user.id} />
        </div>
        
        {/* Desktop: Two-column layout with conversation list */}
        <div className="hidden md:flex md:w-96 md:border-r md:border-gray-200 md:dark:border-gray-700">
          <ConversationList userId={user.id} />
        </div>
        
        {/* Desktop: Chat area placeholder */}
        <div className="hidden md:flex md:flex-1 items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a conversation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
