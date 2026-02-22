import { supabase } from './supabaseClient';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string;
  updated_at: string;
  participant1_name?: string;
  participant2_name?: string;
  participant1_avatar?: string;
  participant2_avatar?: string;
}

export class MessagingService {
  // Get all conversations for current user
  static async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase!
      .from('conversations')
      .select(`
        *,
        participant1:profiles!conversations_participant1_id_fkey(name, avatar_url),
        participant2:profiles!conversations_participant2_id_fkey(name, avatar_url)
      `)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    
    return data?.map(conv => ({
      ...conv,
      participant1_name: conv.participant1?.name,
      participant1_avatar: conv.participant1?.avatar_url,
      participant2_name: conv.participant2?.name,
      participant2_avatar: conv.participant2?.avatar_url,
    })) || [];
  }

  // Get messages for a specific conversation
  static async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase!
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Send a new message
  static async sendMessage(
    conversationId: string,
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<Message> {
    const { data, error } = await supabase!
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim(),
        read: false
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation's last_message_at
    await supabase!
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  }

  // Create or find existing conversation
  static async getOrCreateConversation(
    userId1: string,
    userId2: string
  ): Promise<Conversation> {
    // Check if conversation already exists
    const { data: existingConv, error: fetchError } = await supabase!
      .from('conversations')
      .select('*')
      .or(`(participant1_id.eq.${userId1},participant2_id.eq.${userId2}),(participant1_id.eq.${userId2},participant2_id.eq.${userId1})`)
      .single();

    if (existingConv && !fetchError) {
      return existingConv;
    }

    // Create new conversation
    const { data, error } = await supabase!
      .from('conversations')
      .insert({
        participant1_id: userId1,
        participant2_id: userId2,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Mark messages as read
  static async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await supabase!
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', userId)
      .eq('read', false);
  }

  // Subscribe to new messages in a conversation
  static subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ) {
    return supabase!
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, 
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  }

  // Subscribe to conversation updates
  static subscribeToConversations(
    userId: string,
    callback: (conversation: Conversation) => void
  ) {
    return supabase!
      .channel(`public:conversations:${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'conversations',
          filter: `participant1_id=eq.${userId},participant2_id=eq.${userId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            callback(payload.new as Conversation);
          }
        }
      )
      .subscribe();
  }
}
