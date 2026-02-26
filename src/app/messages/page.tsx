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
import { useAuth } from '@/providers/AuthProvider';
import { ProtectedPage } from '@/components/ProtectedPage';
import { ConversationList } from '@/components/ConversationList';
import { ChatInterface } from '@/components/ChatInterface';

export const dynamic = "force-dynamic";

function MessagesContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const conversationId = params.conversationId as string;

  useEffect(() => {
    if (!user) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [user]);

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
            You don't have permission to view this page.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show conversation list if no specific conversation
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Messages
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {user && <ConversationList userId={user.id} />}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedPage>
      <MessagesContent />
    </ProtectedPage>
  );
}
