/**
 * Dynamic Conversation Page
 * 
 * Handles individual conversation routing
 * Validates access and displays chat interface
 * Works with /messages/[conversationId] route
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ClientHeader } from '@/components/ClientHeader';
import { ChatInterface } from '@/components/ChatInterface';
import { getCurrentUser, Conversation } from '@/lib/supabase';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const conversationId = params.conversationId as string;

  useEffect(() => {
    const checkAuthAndAccess = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);

        // For now, allow access to authenticated users
        // TODO: Implement proper conversation participant checking when schema is updated

        // Fetch conversation details
        const response = await fetch('/api/conversations');
        const data = await response.json();
        
        if (data.conversations) {
          const conv = data.conversations.find((c: Conversation) => c.id === conversationId);
          setConversation(conv || null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndAccess();
  }, [conversationId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <ClientHeader />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading conversation...
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

  if (!conversation) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <ClientHeader />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Conversation Not Found
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This conversation doesn&apos;t exist or you don&apos;t have access to it.
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ClientHeader />
      <ChatInterface
        conversationId={conversationId}
        currentUserId={user.id}
        conversation={conversation}
      />
    </div>
  );
}
