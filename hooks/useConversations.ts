import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useChatAdapter } from '../context/AuthContext';
import { Conversation, WsEvent } from '../types';
import { useUser } from '../stores/authStore';
import { useEffect } from 'react';

export const useConversations = () => {
  const adapter = useChatAdapter();
  const queryClient = useQueryClient();
  const user = useUser();
  const queryKey = ['conversations', user?.id];

  useEffect(() => {
    if (!user) return;

    const handleEvent = (event: WsEvent) => {
      if (event.type === 'message:new') {
        queryClient.setQueryData<Conversation[]>(queryKey, (oldData) => {
          if (!oldData) return [];
          const convIndex = oldData.findIndex(c => c.id === event.payload.conversationId);
          if (convIndex === -1) return oldData; // Conversation not in the current list

          const updatedConv = { ...oldData[convIndex] };
          updatedConv.lastMessage = { body: event.payload.body, createdAt: event.payload.createdAt };
          
          if (event.payload.senderId !== user.id) {
              updatedConv.unreadCount = (updatedConv.unreadCount || 0) + 1;
          }
          
          const newData = [...oldData];
          // Move updated conversation to the top
          newData.splice(convIndex, 1);
          newData.unshift(updatedConv);

          return newData;
        });
      }
    };

    const unsubscribe = adapter.subscribe(handleEvent);
    return () => unsubscribe();

  }, [adapter, queryClient, user, queryKey]);

  return useQuery<Conversation[], Error>({
    queryKey,
    queryFn: () => {
      if (!user?.id) throw new Error('User is not authenticated');
      return adapter.getConversations({ limit: 50 }).then(res => res.items);
    },
    enabled: !!user?.id,
  });
};
