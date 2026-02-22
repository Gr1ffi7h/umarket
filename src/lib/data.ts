/**
 * Local Data Storage
 * 
 * Temporary local data management until database is ready
 * Uses localStorage for listings and messages
 */

export interface Listing {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  condition: string;
  image?: string;
  postedAt: string;
  userId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  createdAt: string;
  participantIds: string[];
}

export const data = {
  // Listings
  getListings: (): Listing[] => {
    try {
      const listingsStr = localStorage.getItem('umarket_listings');
      return listingsStr ? JSON.parse(listingsStr) : [];
    } catch {
      return [];
    }
  },

  saveListings: (listings: Listing[]) => {
    localStorage.setItem('umarket_listings', JSON.stringify(listings));
  },

  addListing: (listing: Listing) => {
    const listings = data.getListings();
    listings.push(listing);
    data.saveListings(listings);
  },

  // Messages
  getMessages: (conversationId: string): Message[] => {
    try {
      const messagesStr = localStorage.getItem(`umarket_messages_${conversationId}`);
      return messagesStr ? JSON.parse(messagesStr) : [];
    } catch {
      return [];
    }
  },

  saveMessages: (conversationId: string, messages: Message[]) => {
    localStorage.setItem(`umarket_messages_${conversationId}`, JSON.stringify(messages));
  },

  addMessage: (conversationId: string, message: Message) => {
    const messages = data.getMessages(conversationId);
    messages.push(message);
    data.saveMessages(conversationId, messages);
  },

  // Conversations
  getConversations: (): Conversation[] => {
    try {
      const conversationsStr = localStorage.getItem('umarket_conversations');
      return conversationsStr ? JSON.parse(conversationsStr) : [];
    } catch {
      return [];
    }
  },

  saveConversations: (conversations: Conversation[]) => {
    localStorage.setItem('umarket_conversations', JSON.stringify(conversations));
  }
};
