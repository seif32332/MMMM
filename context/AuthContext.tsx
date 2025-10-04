import React, { createContext, useContext, ReactNode } from 'react';
import { ChatAdapter } from '../services/chatAdapter';

const ChatContext = createContext<ChatAdapter | null>(null);

interface ChatProviderProps {
  adapter: ChatAdapter;
  children: ReactNode;
}

/**
 * Provides the ChatAdapter instance to the entire application.
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({ adapter, children }) => {
  return (
    <ChatContext.Provider value={adapter}>
      {children}
    </ChatContext.Provider>
  );
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
