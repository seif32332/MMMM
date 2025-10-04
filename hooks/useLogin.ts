import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import * as authService from '../services/authService';
import { useAuthActions } from '../stores/authStore';
import { User } from '../types';
import { useToast } from '../context/ToastContext';

// The arguments for the login function
type LoginCredentials = Parameters<typeof authService.login>;

// The options that can be passed to the hook, excluding the mutation function itself
type UseLoginOptions = Omit<UseMutationOptions<User, Error, { email: string; password: string; }>, 'mutationFn'>;

/**
 * A custom hook for handling user login.
 * It uses React Query's `useMutation` to manage the API call.
 * - On success, it updates the Zustand auth store and React Query's cache.
 * - On error, it displays a toast notification.
 */
export function useLogin(options?: UseLoginOptions) {
  const queryClient = useQueryClient();
  const { setUser, setStatus } = useAuthActions();
  const { showToast } = useToast();

  return useMutation<User, Error, { email: string; password: string; }>({
    // Spread the user-provided options first, so our callbacks can wrap them.
    ...options,
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (user, variables, context, mutation) => {
      // Update the Zustand store with the new user and authenticated status
      setUser(user);
      setStatus('authenticated');
      
      // Invalidate the ['me'] query to ensure any dependent data is refetched with the new auth state.
      // Setting the data directly is faster and avoids an extra network request.
      queryClient.setQueryData(['me'], user);
      
      // Call the original onSuccess if it was provided in the options
      options?.onSuccess?.(user, variables, context, mutation);
    },
    onError: (error, variables, context, mutation) => {
      const message = error instanceof Error ? error.message : 'An unknown login error occurred.';
      showToast(message, 'error');

      // Call the original onError if it was provided
      options?.onError?.(error, variables, context, mutation);
    },
  });
}