import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as followService from '../services/followService';
import { useUser } from '../stores/authStore';
import { User } from '../types';

/**
 * A hook to check the follow status between the current user and a target user.
 * @param targetUserId The ID of the user to check the follow status against.
 */
export const useFollowStatus = (targetUserId: string | undefined) => {
    const viewer = useUser();
    const queryKey = ['followStatus', viewer?.id, targetUserId];

    return useQuery<boolean, Error>({
        queryKey,
        queryFn: () => {
            if (!viewer?.id || !targetUserId) {
                throw new Error('User IDs are required to check follow status.');
            }
            return followService.getFollowStatus(viewer.id, targetUserId);
        },
        enabled: !!viewer?.id && !!targetUserId,
    });
};

/**
 * A hook for following a user.
 */
export const useFollowUser = () => {
    const queryClient = useQueryClient();
    const viewer = useUser();

    return useMutation<void, Error, string>({
        mutationFn: (targetUserId: string) => {
            if (!viewer?.id) throw new Error('Viewer not authenticated');
            return followService.followUser(viewer.id, targetUserId);
        },
        onSuccess: (data, targetUserId) => {
            // Invalidate the follow status to refetch it
            queryClient.invalidateQueries({ queryKey: ['followStatus', viewer?.id, targetUserId] });
            // Optionally, invalidate the target user's profile to update follower count
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};

/**
 * A hook for unfollowing a user.
 */
export const useUnfollowUser = () => {
    const queryClient = useQueryClient();
    const viewer = useUser();

    return useMutation<void, Error, string>({
        mutationFn: (targetUserId: string) => {
            if (!viewer?.id) throw new Error('Viewer not authenticated');
            return followService.unfollowUser(viewer.id, targetUserId);
        },
        onSuccess: (data, targetUserId) => {
            queryClient.invalidateQueries({ queryKey: ['followStatus', viewer?.id, targetUserId] });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};
