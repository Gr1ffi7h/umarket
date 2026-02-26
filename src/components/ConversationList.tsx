/**
 * Conversation List Component
 * 
 * Displays all conversations for the logged-in user
 * Shows listing title, participant name, last message preview
 * Minimal, responsive design with real-time updates
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import { MessagingService, Conversation } from '@/lib/messaging';

interface ConversationListProps {
  userId: string;
}

export function ConversationList({ userId }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        const convs = await MessagingService.getConversations(user.id);
        setConversations(convs);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    // Subscribe to real-time updates
    const subscription = MessagingService.subscribeToConversations(user.id, (updatedConv) => {
      setConversations(prev => {
        const index = prev.findIndex(c => c.id === updatedConv.id);
        if (index >= 0) {
          const newConvs = [...prev];
          newConvs[index] = updatedConv;
          return newConvs.sort((a, b) => 
            new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
          );
        } else {
          return [updatedConv, ...prev].sort((a, b) => 
            new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
          );
        }
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    
    const isParticipant1 = conversation.participant1_id === user.id;
    
    return {
      id: isParticipant1 ? conversation.participant2_id : conversation.participant1_id,
      username: isParticipant1 ? conversation.participant2_name || 'User' : conversation.participant1_name || 'User',
      avatar_url: isParticipant1 ? conversation.participant2_avatar : conversation.participant1_avatar,
    };
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Loading conversations...
          </div>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            No conversations yet
          </h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Start a conversation by contacting sellers from listings
          </p>
          <Link 
            href="/browse" 
            className="inline-block mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Browse Listings →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
        Messages
      </h1>
      
      <div className="space-y-2">
        {conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          
          return (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {otherParticipant?.avatar_url ? (
                    <Image 
                      src={otherParticipant.avatar_url} 
                      alt={otherParticipant.username}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {otherParticipant?.username?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {otherParticipant?.username || 'Unknown User'}
                    </h3>
                    {conversation.last_message_at && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(conversation.last_message_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    No messages yet
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
