import React, { createContext, useContext, ReactNode } from 'react';
import { Conversation, Message, Paginated, WsEvent } from '../types';

/**
 * Defines the contract for any chat service implementation.
 * This abstraction allows swapping between a mock service and a real WebSocket/REST service
 * without changing the UI components.
 */
export interface ChatAdapter {
  /**
   * Fetches a paginated list of conversations for the current user.
   */
  getConversations(options: { cursor?: string; limit?: number }): Promise<Paginated<Conversation>>;

  /**
   * Fetches a paginated list of messages for a specific conversation.
   */
  getMessages(conversationId: string, options: { cursor?: string; limit?: number }): Promise<Paginated<Message>>;

  /**
   * Sends a new message to a conversation.
   * @param tempId A temporary client-side ID for optimistic updates.
   */
  sendMessage(conversationId: string, tempId: string, body: string): Promise<void>;

  /**
   * Marks all messages in a conversation as read.
   */
  markAsRead(conversationId: string): Promise<void>;

  /**
   * Notifies the server about the user's typing status.
   */
  sendTypingUpdate(conversationId: string, isTyping: boolean): Promise<void>;

  /**
   * Subscribes to real-time events from the chat service.
   * @param callback A function to be called with any new WsEvent.
   * @returns An unsubscribe function.
   */
  subscribe(callback: (event: WsEvent) => void): () => void;
}

// --- React Context for Dependency Injection ---

const ChatContext = createContext<ChatAdapter | null>(null);

interface ChatProviderProps {
  adapter: ChatAdapter;
  children: ReactNode;
}

/**
 * Provides the ChatAdapter instance to the entire application.
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({ adapter, children }) => {
  // FIX: Replaced JSX syntax with React.createElement because this is a .ts file, not .tsx.
  // JSX is not valid in .ts files and causes parsing errors.
  return React.createElement(ChatContext.Provider, { value: adapter }, children);
};

/**
 * A custom hook to access the ChatAdapter from any component.
 * This is the single point of interaction with the chat service for the UI.
 */
export const useChatAdapter = (): ChatAdapter => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatAdapter must be used within a ChatProvider');
  }
  return context;
};