import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as messageService from '../services/messageService';
import { useUser } from '../stores/authStore';
import { Conversation } from '../types';

/**
 * A hook to initiate a conversation with a target user.
 * It finds or creates the conversation and then navigates to the chat window.
 */
export const useStartConversation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const currentUser = useUser();

    return useMutation<Conversation, Error, string>({
        mutationFn: (targetUserId: string) => {
            if (!currentUser) {
                throw new Error("User not authenticated.");
            }
            if (currentUser.id === targetUserId) {
                throw new Error("Cannot start a conversation with yourself.");
            }
            return messageService.findOrCreateConversation([currentUser.id, targetUserId]);
        },
        onSuccess: (conversation) => {
            // Invalidate conversation list to ensure it's up-to-date
            queryClient.invalidateQueries({ queryKey: ['conversations', currentUser?.id] });
            // Navigate to the newly created or found conversation
            navigate(`/messages/${conversation.id}`);
        },
    });
};