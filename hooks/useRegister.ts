import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import * as authService from '../services/authService';
import { User } from '../types';

type RegisterResponse = { success: boolean };
type RegisterPayload = { email: string; password: string };

type UseRegisterOptions = Omit<UseMutationOptions<RegisterResponse, Error, RegisterPayload>, 'mutationFn'>;

/**
 * A hook for registering a new user.
 * After a successful mutation, the component is responsible for showing a message
 * prompting the user to verify their email. This hook does not log the user in.
 */
export function useRegister(options?: UseRegisterOptions) {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    ...options,
    mutationFn: ({ email, password }) => authService.register(email, password),
  });
}