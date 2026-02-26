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
import { useAuth } from '@/providers/AuthProvider';
import { ProtectedPage } from '@/components/ProtectedPage';
import { ChatInterface } from '@/components/ChatInterface';

export const dynamic = "force-dynamic";

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt: string;
}

function ConversationContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const conversationId = params.conversationId as string;

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      // For now, allow access to authenticated users
      // TODO: Implement proper conversation participant checking when schema is updated
      setConversation(null);
      setLoading(false);
    };

    checkAccess();
  }, [conversationId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don&apos;t have permission to view this conversation.
          </p>
          <button
            onClick={() => router.push('/messages')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Conversation Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This conversation doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <button
            onClick={() => router.push('/messages')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {user && <ChatInterface
        conversationId={conversationId}
        currentUserId={user.id}
        conversation={conversation}
      />}
    </div>
  );
}

export default function ConversationPage() {
  return (
    <ProtectedPage>
      <ConversationContent />
    </ProtectedPage>
  );
}
