import { useState, useEffect } from 'react';
import { useChatAdapter } from '../context/AuthContext';
import { WsEvent } from '../types';
import { useUser } from '../stores/authStore';

/**
 * A hook that provides the real-time typing status of participants in a conversation.
 * @param conversationId The ID of the conversation to monitor.
 * @returns An array of user IDs that are currently typing.
 */
export const useTypingIndicator = (conversationId: string | undefined) => {
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const adapter = useChatAdapter();
  const currentUser = useUser();

  useEffect(() => {
    if (!conversationId) return;

    const handleEvent = (event: WsEvent) => {
      if (event.type === 'typing:update' && event.payload.conversationId === conversationId) {
        const { userId, isTyping } = event.payload;
        // Don't show typing indicator for the current user
        if (userId === currentUser?.id) return;
        
        setTypingUserIds(prev => {
          const isUserTyping = prev.includes(userId);
          if (isTyping && !isUserTyping) {
            return [...prev, userId];
          }
          if (!isTyping && isUserTyping) {
            return prev.filter(id => id !== userId);
          }
          return prev;
        });
      }
    };

    const unsubscribe = adapter.subscribe(handleEvent);
    return () => {
      unsubscribe();
      setTypingUserIds([]); // Clean up on unmount
    };
  }, [conversationId, adapter, currentUser?.id]);

  return typingUserIds;
};
