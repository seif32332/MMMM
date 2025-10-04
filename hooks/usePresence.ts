import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatAdapter } from '../services/chatAdapter';
import { WsEvent, UserStatus, Conversation } from '../types';

/**
 * Subscribes to presence updates and keeps the React Query cache for conversations fresh.
 * This is more of a background hook and doesn't return a value directly.
 */
export const usePresenceSubscriber = () => {
    const queryClient = useQueryClient();
    const adapter = useChatAdapter();

    useEffect(() => {
        const handleEvent = (event: WsEvent) => {
            if (event.type === 'presence:update') {
                const { userId, status, lastSeen } = event.payload;

                // Update the conversation list cache
                queryClient.setQueryData<Conversation[]>(['conversations'], (oldData) => {
                    if (!oldData) return [];
                    return oldData.map(conv => ({
                        ...conv,
                        participants: conv.participants.map(p =>
                            p.id === userId ? { ...p, status, lastSeen } : p
                        ),
                    }));
                });
            }
        };

        const unsubscribe = adapter.subscribe(handleEvent);
        return () => unsubscribe();
    }, [adapter, queryClient]);
};


/**
 * A hook to get the real-time presence status for a specific user.
 * @param userId The ID of the user to monitor.
 * @returns The user's current status ('online' or 'offline').
 */
export const usePresence = (userId: string | undefined): UserStatus | undefined => {
    const [status, setStatus] = useState<UserStatus | undefined>(undefined);
    const adapter = useChatAdapter();

    useEffect(() => {
        if (!userId) return;

        const handleEvent = (event: WsEvent) => {
            if (event.type === 'presence:update' && event.payload.userId === userId) {
                setStatus(event.payload.status);
            }
        };

        const unsubscribe = adapter.subscribe(handleEvent);
        return () => unsubscribe();
    }, [userId, adapter]);

    return status;
};