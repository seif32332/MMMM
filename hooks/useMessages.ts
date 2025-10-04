import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useChatAdapter } from '../context/AuthContext';
import { Message, WsEvent } from '../types';
import { useEffect } from 'react';

export const useMessages = (conversationId: string | undefined) => {
  const adapter = useChatAdapter();
  const queryClient = useQueryClient();
  const queryKey = ['messages', conversationId];

  useEffect(() => {
    if (!conversationId) return;

    const handleEvent = (event: WsEvent) => {
        switch(event.type) {
            case 'message:new':
                if (event.payload.conversationId === conversationId) { 
                    queryClient.setQueryData<Message[]>(queryKey, (oldData = []) => {
                         // Avoid adding duplicates from optimistic updates
                        if (oldData.some(m => m.id === event.payload.id || (m.tempId && m.tempId === event.payload.tempId))) {
                            return oldData;
                        }
                        return [...oldData, event.payload]
                    });
                }
                break;
            case 'message:ack':
                 if (event.payload.conversationId === conversationId) {
                    queryClient.setQueryData<Message[]>(queryKey, (oldData = []) => 
                        oldData.map(m => m.id === event.payload.tempId ? { ...m, id: event.payload.serverId, status: 'sent', createdAt: event.payload.createdAt } : m)
                    );
                 }
                break;
            case 'delivery:update':
                if (event.payload.conversationId === conversationId) {
                    queryClient.setQueryData<Message[]>(queryKey, (oldData = []) =>
                        oldData.map(m => m.id === event.payload.messageId ? { ...m, status: event.payload.status.toLowerCase() as Message['status'] } : m)
                    );
                }
                break;
        }
    };

    const unsubscribe = adapter.subscribe(handleEvent);
    return () => unsubscribe();
  }, [conversationId, adapter, queryClient, queryKey]);


  return useQuery<Message[], Error>({
    queryKey,
    queryFn: () => {
      if (!conversationId) return Promise.resolve([]);
      // Assuming getMessages returns items in reverse chronological order for infinite loading
      return adapter.getMessages(conversationId, { limit: 50 }).then(res => res.items.reverse());
    },
    enabled: !!conversationId,
  });
};
