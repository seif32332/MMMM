import { Deal, User } from '../types';

// --- MOCK DATABASE ---
const mockUsers = {
    'user-1': { id: 'user-1', fullName: 'Faisal Al-Saud', username: 'faisal', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bear' },
    'user-2': { id: 'user-2', fullName: 'Noor Al-Huda', username: 'noor', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bandit' },
    'user-4': { id: 'user-4', fullName: 'Fatima Al-Fassi', username: 'fatima', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Abby' },
};

let mockDeals: Deal[] = [
    {
        id: 'deal-1',
        title: 'Seed Round for AI-Powered Logistics Platform',
        summary: 'We are raising a seed round to expand our AI-driven last-mile delivery solution across the GCC. We have signed 3 major clients and have a growing waitlist.',
        industry: 'Logistics',
        stage: 'Seed',
        amountMin: 500000,
        amountMax: 1500000,
        country: 'Saudi Arabia',
        owner: mockUsers['user-2'],
        companyId: 'company-1',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
    {
        id: 'deal-2',
        title: 'Pre-Seed for a Sustainable Fashion Marketplace',
        summary: 'Seeking pre-seed funding for our e-commerce platform that connects consumers with sustainable and ethical fashion brands from the region.',
        industry: 'eCommerce',
        stage: 'Pre-Seed',
        amountMin: 150000,
        amountMax: 300000,
        country: 'UAE',
        owner: mockUsers['user-4'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    },
    {
        id: 'deal-3',
        title: 'Series A for B2B SaaS FinTech Solution',
        summary: 'Our platform automates invoicing and payments for SMEs. We have achieved $1M ARR and are raising a Series A to expand our sales team.',
        industry: 'FinTech',
        stage: 'Series A',
        amountMin: 5000000,
        amountMax: 10000000,
        country: 'Saudi Arabia',
        owner: mockUsers['user-1'],
        companyId: 'company-2',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    },
];
// --- END MOCK DATABASE ---

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface GetDealsFilters {
    ownerId?: string;
    companyId?: string;
}

/**
 * Fetches a list of deals, optionally filtered.
 */
export const getDeals = async (filters: GetDealsFilters = {}): Promise<Deal[]> => {
    await sleep(500);
    
    let results = [...mockDeals];

    if (filters.ownerId) {
        results = results.filter(deal => deal.owner.id === filters.ownerId);
    }

    if (filters.companyId) {
        results = results.filter(deal => deal.companyId === filters.companyId);
    }
    
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Fetches a single deal by its ID.
 */
export const getDealById = async (id: string): Promise<Deal> => {
    await sleep(300);
    const deal = mockDeals.find(d => d.id === id);
    if (deal) {
        return deal;
    }
    return Promise.reject(new Error('Deal not found'));
};

/**
 * Creates a new deal.
 */
export const createDeal = async (dealData: Omit<Deal, 'id' | 'createdAt' | 'owner'>, owner: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'username'>): Promise<Deal> => {
    await sleep(600);
    const newDeal: Deal = {
        ...dealData,
        id: `deal-${Date.now()}`,
        createdAt: new Date().toISOString(),
        owner,
    };
    mockDeals.unshift(newDeal);
    return newDeal;
};