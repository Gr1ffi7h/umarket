import { getSupabaseBrowserClient } from './supabaseClient';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface ConversationSummary {
  id: string;
  created_at: string;
  last_message_at: string | null;
  last_message: string | null;
  other_participant: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export class MessagingService {
  static async getConversations(userId: string): Promise<ConversationSummary[]> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return [];

    const { data: participantRows, error: participantError } = await supabase
      .from('conversation_participants')
      .select('conversation_id, conversations(id, created_at)')
      .eq('user_id', userId);

    if (participantError) return [];

    const conversationIds = (participantRows || [])
      .map((r: any) => r.conversation_id as string)
      .filter(Boolean);

    if (conversationIds.length === 0) return [];

    const { data: participants, error: participantsError } = await supabase
      .from('conversation_participants')
      .select('conversation_id, user_id, profiles(id, full_name, avatar_url)')
      .in('conversation_id', conversationIds);

    if (participantsError) return [];

    const { data: lastMessages, error: lastMessagesError } = await supabase
      .from('messages')
      .select('conversation_id, content, created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false });

    const lastMessageByConversation = new Map<string, { content: string; created_at: string }>();
    if (!lastMessagesError && Array.isArray(lastMessages)) {
      for (const row of lastMessages as any[]) {
        if (!lastMessageByConversation.has(row.conversation_id)) {
          lastMessageByConversation.set(row.conversation_id, { content: row.content, created_at: row.created_at });
        }
      }
    }

    const participantsByConversation = new Map<string, any[]>();
    for (const row of participants as any[]) {
      const list = participantsByConversation.get(row.conversation_id) ?? [];
      list.push(row);
      participantsByConversation.set(row.conversation_id, list);
    }

    const createdAtByConversation = new Map<string, string>();
    for (const row of participantRows as any[]) {
      const conv = row.conversations;
      if (conv?.id && conv?.created_at) {
        createdAtByConversation.set(conv.id, conv.created_at);
      }
    }

    const summaries: ConversationSummary[] = conversationIds.map((id) => {
      const convoParticipants = participantsByConversation.get(id) ?? [];
      const other = convoParticipants.find((p: any) => p.user_id !== userId)?.profiles ?? null;
      const last = lastMessageByConversation.get(id) ?? null;

      return {
        id,
        created_at: createdAtByConversation.get(id) ?? new Date().toISOString(),
        last_message_at: last?.created_at ?? null,
        last_message: last?.content ?? null,
        other_participant: other
          ? {
              id: other.id,
              full_name: other.full_name ?? null,
              avatar_url: other.avatar_url ?? null,
            }
          : null,
      };
    });

    summaries.sort((a, b) => {
      const aTime = a.last_message_at ?? a.created_at;
      const bTime = b.last_message_at ?? b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return summaries;
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) return [];
    return (data as any) || [];
  }

  static async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message | null> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;

    const trimmed = content.trim();
    if (!trimmed) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: trimmed,
      })
      .select()
      .single();

    if (error) return null;
    return data as any;
  }
}
