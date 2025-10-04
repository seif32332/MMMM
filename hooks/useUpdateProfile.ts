
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import * as userService from '../services/userService';
import { useAuthActions } from '../stores/authStore';
import { Profile, User } from '../types';

type UpdateProfilePayload = Parameters<typeof userService.updateUserProfile>[0];

type UseUpdateProfileOptions = Omit<UseMutationOptions<Profile, Error, UpdateProfilePayload>, 'mutationFn'>;

export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthActions();

  return useMutation<Profile, Error, UpdateProfilePayload>({
    ...options,
    mutationFn: userService.updateUserProfile,
    onSuccess: (updatedProfile, variables, context, mutation) => {
      const payload: Partial<User & { profile: Partial<Profile> }> = {
        ...variables,
        profile: updatedProfile
      };
      
      // Update the Zustand store using the dedicated action
      updateUser(payload);
      
      // Optimistically update the ['me'] query cache with the same combined data
      queryClient.setQueryData<User>(['me'], (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          ...variables,
          profile: {
            ...(oldData.profile || {} as Profile),
            ...updatedProfile
          }
        };
      });

      // Invalidate the profile query for the user to ensure freshness
      // This is useful if other parts of the app use the useUserProfile hook
      const username = variables.username || queryClient.getQueryData<User>(['me'])?.username;
      if (username) {
        queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
      }
      
      // Call original onSuccess if provided
      options?.onSuccess?.(updatedProfile, variables, context, mutation);
    },
  });
};