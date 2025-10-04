import { Company } from '../types';

// --- MOCK DATABASE ---
let mockCompanies: Record<string, Company> = {
    'company-1': {
        id: 'company-1',
        slug: 'swift-deliver',
        name: 'SwiftDeliver Inc.',
        logoUrl: 'https://api.dicebear.com/8.x/logo/svg?seed=SwiftDeliver',
        industry: 'Logistics',
        location: 'Jeddah, Saudi Arabia',
        website: 'https://swiftdeliver.sa',
        description: 'The fastest and most reliable last-mile delivery service in the Kingdom.',
        ownerId: 'user-2',
    },
    'company-2': {
        id: 'company-2',
        slug: 'future-ventures',
        name: 'Future Ventures',
        logoUrl: 'https://api.dicebear.com/8.x/logo/svg?seed=FutureVentures',
        industry: 'Venture Capital',
        location: 'Riyadh, Saudi Arabia',
        website: 'https://futureventures.sa',
        description: 'Investing in the future of technology in the MENA region.',
        ownerId: 'user-1',
    }
};
// --- END MOCK DATABASE ---

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches a company's public profile by its unique slug.
 * @param slug The unique slug of the company.
 * @returns A promise that resolves with the Company object.
 */
export const getCompanyBySlug = async (slug: string): Promise<Company> => {
    await sleep(400);
    const company = Object.values(mockCompanies).find(c => c.slug === slug);
    if (company) {
        return company;
    }
    return Promise.reject(new Error('Company not found'));
};


/**
 * Creates a new company page.
 * @param companyData - The data for the new company.
 * @returns A promise that resolves with the newly created company.
 */
export const createCompany = async (companyData: Omit<Company, 'id' | 'ownerId'>, ownerId: string): Promise<Company> => {
    await sleep(500);
    const newId = `company-${Date.now()}`;
    const newCompany: Company = {
        ...companyData,
        id: newId,
        ownerId,
    };
    mockCompanies[newId] = newCompany;
    return newCompany;
};