import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '../services/authService';
import { useAuthActions } from '../stores/authStore';
import { User } from '../types';

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  const { setUser, setStatus } = useAuthActions();

  return useMutation<User, Error, string>({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: (user) => {
      // After verification, the user is now considered logged in and verified.
      setUser(user);
      setStatus('authenticated');
      queryClient.setQueryData(['me'], user);
    },
  });
};
