import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatAdapter } from '../context/AuthContext';
import { useUser } from '../stores/authStore';
import { Message } from '../types';

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const adapter = useChatAdapter();

  return useMutation({
    mutationFn: ({ body, tempId }: { body: string; tempId: string }) => {
      if (!user) throw new Error('User not authenticated');
      return adapter.sendMessage(conversationId, tempId, body).then(() => ({ tempId, body }));
    },
    onMutate: async ({ tempId, body }) => {
      if (!user) return;
      
      const queryKey = ['messages', conversationId];
      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData<Message[]>(queryKey);

      const optimisticMessage: Message = {
        id: tempId,
        tempId: tempId,
        conversationId: conversationId,
        senderId: user.id,
        body,
        createdAt: new Date().toISOString(),
        status: 'sending',
      };

      queryClient.setQueryData<Message[]>(queryKey, (old) => [...(old || []), optimisticMessage]);

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      const queryKey = ['messages', conversationId];
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages);
      }
    },
    onSettled: () => {
      // Invalidation is less critical now with subscriptions, but can be useful for consistency.
      // queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      // queryClient.invalidateQueries({ queryKey: ['conversations'] }); 
    },
  });
};
