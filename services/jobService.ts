import { Job, Company } from '../types';

// --- MOCK DATABASE ---
const mockCompanies = {
    'company-1': { id: 'company-1', name: 'SwiftDeliver Inc.', slug: 'swift-deliver', logoUrl: 'https://api.dicebear.com/8.x/logo/svg?seed=SwiftDeliver', ownerId: 'user-2' },
    'company-2': { id: 'company-2', name: 'Future Ventures', slug: 'future-ventures', logoUrl: 'https://api.dicebear.com/8.x/logo/svg?seed=FutureVentures', ownerId: 'user-1' },
};

let mockJobs: Job[] = [
    {
        id: 'job-1',
        title: 'Senior Frontend Engineer (React & TypeScript)',
        description: 'We are looking for an experienced Frontend Engineer to join our core product team. You will be responsible for building and maintaining our user-facing applications, working with modern technologies like React, TypeScript, and GraphQL.',
        location: 'Riyadh, Saudi Arabia (Hybrid)',
        employmentType: 'full_time',
        company: mockCompanies['company-1'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: 'job-2',
        title: 'Investment Analyst',
        description: 'Future Ventures is seeking a sharp and analytical Investment Analyst to help us identify and evaluate the most promising startups in the MENA region. You will be involved in due diligence, market research, and portfolio support.',
        location: 'Riyadh, Saudi Arabia',
        employmentType: 'full_time',
        company: mockCompanies['company-2'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
    {
        id: 'job-3',
        title: 'Part-Time UI/UX Designer',
        description: 'We need a creative UI/UX designer to help us with a short-term project to redesign our mobile application. This is a 3-month contract role, fully remote.',
        location: 'Remote',
        employmentType: 'contract',
        company: mockCompanies['company-1'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    }
];
// --- END MOCK DATABASE ---

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface GetJobsFilters {
    companyId?: string;
}

/**
 * Fetches a list of jobs, optionally filtered.
 */
export const getJobs = async (filters: GetJobsFilters = {}): Promise<Job[]> => {
    await sleep(500);

    let results = [...mockJobs];

    if (filters.companyId) {
        results = results.filter(job => job.company.id === filters.companyId);
    }
    
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Fetches a single job by its ID.
 */
export const getJobById = async (id: string): Promise<Job> => {
    await sleep(300);
    const job = mockJobs.find(j => j.id === id);
    if (job) {
        return job;
    }
    return Promise.reject(new Error('Job not found'));
};

/**
 * Creates a new job posting.
 */
export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'company'>, company: Pick<Company, 'id' | 'name' | 'slug' | 'logoUrl' | 'ownerId'>): Promise<Job> => {
    await sleep(600);
    const newJob: Job = {
        ...jobData,
        id: `job-${Date.now()}`,
        createdAt: new Date().toISOString(),
        company,
    };
    mockJobs.unshift(newJob);
    return newJob;
};