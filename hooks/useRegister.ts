import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import * as authService from '../services/authService';
import { useAuthActions } from '../stores/authStore';
import { User } from '../types';

type RegisterCredentials = Parameters<typeof authService.register>;

type UseRegisterOptions = Omit<UseMutationOptions<User, Error, { email: string; password: string; }>, 'mutationFn'>;

export function useRegister(options?: UseRegisterOptions) {
  const queryClient = useQueryClient();
  const { setUser, setStatus } = useAuthActions();

  return useMutation<User, Error, { email: string; password: string; }>({
    ...options,
    mutationFn: ({ email, password }) => authService.register(email, password),
    onSuccess: (user, variables, context, mutation) => {
      // Update the Zustand store with the new user and authenticated status
      setUser(user);
      setStatus('authenticated');
      
      // Set the user data in the React Query cache for the ['me'] key
      queryClient.setQueryData(['me'], user);
      
      // Call the original onSuccess if it was provided
      options?.onSuccess?.(user, variables, context, mutation);
    },
  });
}