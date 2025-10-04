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
