import { useQuery } from '@tanstack/react-query';
import * as walletService from '../services/walletService';
import { useUser } from '../stores/authStore';
import { Wallet } from '../types';

export const useWallet = () => {
    const user = useUser();
    const queryKey = ['wallet', user?.id];

    return useQuery<Wallet, Error>({
        queryKey,
        queryFn: () => {
            if (!user?.id) throw new Error('User is not authenticated');
            return walletService.getWallet(user.id);
        },
        enabled: !!user?.id,
    });
};
