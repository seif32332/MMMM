import { Wallet, Currency, WalletTx, TxKind, TxStatus, DealAllocation } from '../types';

// --- MOCK DATABASE ---
let mockWallets: Record<string, Wallet> = {};
let mockTransactions: Record<string, WalletTx[]> = {};
let mockAllocations: Record<string, DealAllocation[]> = {};

const initializeWalletForUser = (userId: string) => {
    if (!mockWallets[userId]) {
        const walletId = `wallet-${userId}`;
        mockWallets[userId] = {
            id: walletId,
            userId,
            currency: Currency.SAR,
            balance: 0n,
            available: 0n,
            locked: 0n,
            transactions: [],
        };
        mockTransactions[walletId] = [];
        mockAllocations[walletId] = [];
    }
    // Ensure transactions are linked
    const wallet = mockWallets[userId];
    wallet.transactions = mockTransactions[wallet.id] || [];
};

// Initialize for the default user
initializeWalletForUser('user-1');
// --- END MOCK DATABASE ---

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Recalculates wallet balances based on the transaction ledger and allocations.
const recalcWallet = (walletId: string) => {
    const transactions = mockTransactions[walletId] || [];
    const allocations = mockAllocations[walletId] || [];

    const balance = transactions
        .filter(tx => tx.status === TxStatus.SUCCEEDED)
        .reduce((sum, tx) => sum + tx.amount, 0n);

    const locked = allocations
        .filter(alloc => alloc.status === 'LOCKED')
        .reduce((sum, alloc) => sum + alloc.amount, 0n);

    const wallet = Object.values(mockWallets).find(w => w.id === walletId);
    if (wallet) {
        wallet.balance = balance;
        wallet.locked = locked;
        wallet.available = balance - locked;
    }
};

/**
 * Gets the wallet for a user, creating one if it doesn't exist.
 */
export const getWallet = async (userId: string): Promise<Wallet> => {
    await sleep(300);
    initializeWalletForUser(userId);
    recalcWallet(mockWallets[userId].id); // Always recalc on fetch for consistency
    return { ...mockWallets[userId] };
};

/**
 * Simulates creating a payment intent and topping up the wallet on success.
 */
export const createTopupIntent = async (userId: string, amount: bigint): Promise<{ success: boolean }> => {
    await sleep(700);
    const wallet = await getWallet(userId);
    
    // In a real app, this would return a client secret from a payment provider.
    // Here, we'll simulate the successful webhook call immediately.

    const newTx: WalletTx = {
        id: `tx-${Date.now()}`,
        walletId: wallet.id,
        kind: TxKind.TOPUP_GATEWAY,
        status: TxStatus.SUCCEEDED,
        amount: amount,
        currency: wallet.currency,
        reference: `ch_${Date.now()}`,
        createdAt: new Date().toISOString(),
    };

    mockTransactions[wallet.id].push(newTx);
    recalcWallet(wallet.id);

    return { success: true };
};

/**
 * Allocates funds from a wallet to a deal, locking the amount.
 */
export const allocateFunds = async (userId: string, dealId: string, amount: bigint): Promise<DealAllocation> => {
    await sleep(500);
    const wallet = await getWallet(userId);
    
    if (wallet.available < amount) {
        throw new Error('Insufficient available balance.');
    }

    const newAllocation: DealAllocation = {
        id: `alloc-${Date.now()}`,
        walletId: wallet.id,
        dealId,
        amount,
        status: 'LOCKED',
        createdAt: new Date().toISOString(),
    };

    mockAllocations[wallet.id].push(newAllocation);
    
    // As per the spec, an allocation also creates a ledger transaction
    const newTx: WalletTx = {
        id: `tx-alloc-${Date.now()}`,
        walletId: wallet.id,
        kind: TxKind.ALLOCATE_TO_DEAL,
        status: TxStatus.SUCCEEDED,
        amount: -amount, // Debit the balance
        currency: wallet.currency,
        meta: { allocationId: newAllocation.id },
        createdAt: new Date().toISOString(),
    };
    mockTransactions[wallet.id].push(newTx);

    recalcWallet(wallet.id);

    return newAllocation;
};