import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import * as dealService from '../services/dealService';
import { useUser } from '../stores/authStore';
import { Deal } from '../types';

type CreateDealPayload = Omit<Deal, 'id' | 'createdAt' | 'owner'>;
type UseCreateDealOptions = Omit<UseMutationOptions<Deal, Error, CreateDealPayload>, 'mutationFn'>;

export const useCreateDeal = (options?: UseCreateDealOptions) => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation<Deal, Error, CreateDealPayload>({
    ...options,
    mutationFn: (dealData) => {
      if (!user) {
        throw new Error('User must be logged in to create a deal.');
      }
      const owner = {
        id: user.id,
        fullName: user.fullName || 'Anonymous',
        username: user.username || 'anonymous',
        avatarUrl: user.avatarUrl,
      };
      return dealService.createDeal(dealData, owner);
    },
    onSuccess: (newDeal, variables, context, mutation) => {
      // When a deal is created, invalidate the 'deals' query to refetch the list.
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      // Call original onSuccess if provided
      options?.onSuccess?.(newDeal, variables, context, mutation);
    },
  });
};