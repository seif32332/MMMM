import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as walletService from '../services/walletService';
import { useUser } from '../stores/authStore';

// --- Top-up Mutation ---

export const useCreateTopupIntent = () => {
    const queryClient = useQueryClient();
    const user = useUser();

    return useMutation({
        mutationFn: (amount: bigint) => {
            if (!user?.id) throw new Error('User not authenticated');
            return walletService.createTopupIntent(user.id, amount);
        },
        onSuccess: () => {
            // Refetch wallet data after a successful top-up
            queryClient.invalidateQueries({ queryKey: ['wallet', user?.id] });
        },
    });
};


// --- Fund Allocation Mutation ---

interface AllocateFundsPayload {
    dealId: string;
    amount: bigint;
}

export const useAllocateFunds = () => {
    const queryClient = useQueryClient();
    const user = useUser();

    return useMutation({
        mutationFn: ({ dealId, amount }: AllocateFundsPayload) => {
            if (!user?.id) throw new Error('User not authenticated');
            return walletService.allocateFunds(user.id, dealId, amount);
        },
        onSuccess: () => {
            // Refetch wallet data after allocation to update balances
            queryClient.invalidateQueries({ queryKey: ['wallet', user?.id] });
        },
    });
};
