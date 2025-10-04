import { Profile, User, UserPrimaryRole } from '../types';
import { http } from './api';

// --- MOCK DATABASE ---
const mockUsers: Record<string, User> = {
    'user-1': {
        id: 'user-1',
        email: 'faisal@example.com',
        username: 'faisal',
        fullName: 'Faisal Al-Saud',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bear',
        bannerUrl: 'https://source.unsplash.com/1600x900/?abstract,blue',
        companyMemberships: [
            { companyId: 'company-2', companyName: 'Future Ventures', companySlug: 'future-ventures', role: 'OWNER' }
        ],
        profile: {
            primaryRole: UserPrimaryRole.INVESTOR,
            headline: 'Angel Investor @ Future Ventures',
            bio: 'Investing in the next generation of Saudi startups. Focused on SaaS, FinTech, and Logistics. Ex-Aramco.',
            location: 'Riyadh, Saudi Arabia',
            onboardingDetails: {
                ticketMin: 100000,
                ticketMax: 500000,
                stages: ['seed', 'series_a'],
                sectors: ['SaaS', 'FinTech', 'Logistics'],
            },
            profileCompleted: true,
            followersCount: 1250,
            followingCount: 320,
        },
    },
     'user-2': {
        id: 'user-2',
        email: 'noor@example.com',
        username: 'noor',
        fullName: 'Noor Al-Huda',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bandit',
        bannerUrl: 'https://source.unsplash.com/1600x900/?abstract,green',
        companyMemberships: [
            { companyId: 'company-1', companyName: 'SwiftDeliver Inc.', companySlug: 'swift-deliver', role: 'OWNER' }
        ],
        profile: {
            primaryRole: UserPrimaryRole.FOUNDER,
            headline: 'Founder & CEO @ SwiftDeliver',
            bio: 'Building the future of last-mile delivery in the MENA region. We are currently raising our Seed round!',
            location: 'Jeddah, Saudi Arabia',
            onboardingDetails: {
                stage: 'seed',
                amountMin: 500000,
                amountMax: 1500000,
                sectors: ['Logistics', 'eCommerce'],
            },
            profileCompleted: true,
            followersCount: 890,
            followingCount: 150,
        }
    },
    'user-3': {
        id: 'user-3',
        email: 'ahmed@example.com',
        username: 'ahmed',
        fullName: 'Ahmed Khan',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Ahmed',
        profile: {
            primaryRole: UserPrimaryRole.JOB_SEEKER,
            headline: 'Senior Full-Stack Engineer',
            location: 'Dammam, Saudi Arabia',
            onboardingDetails: {
                title: 'Senior Full-Stack Engineer',
                skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
                experience: 7,
                locations: ['Riyadh', 'Dammam', 'Remote'],
            },
            profileCompleted: true,
        },
    },
    'user-4': {
        id: 'user-4',
        email: 'omar@example.com',
        username: 'omar',
        fullName: 'Omar Youssef',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Omar',
        profile: {
            primaryRole: UserPrimaryRole.INVESTOR,
            headline: 'VC at Mena Growth Capital',
            location: 'Dubai, UAE',
            onboardingDetails: {
                ticketMin: 500000,
                ticketMax: 2000000,
                stages: ['seed', 'series_a'],
                sectors: ['FinTech', 'AI', 'HealthTech'],
            },
            profileCompleted: true,
        },
    }
};
// --- END MOCK DATABASE ---

/**
 * Fetches all users.
 * NOTE: In a real application, this would be paginated and likely have filters.
 */
export const getAllUsers = async (): Promise<User[]> => {
    return Promise.resolve(Object.values(mockUsers));
};

/**
 * Fetches the currently authenticated user's data from the server.
 * Relies on the HttpOnly cookie being sent automatically by the browser.
 * @returns A promise that resolves with the User object.
 */
export const getCurrentUser = (): Promise<User> => {
  // In a real app, this would be an API call:
  // return http.get<User>('/api/users/me');
  console.log("Fetching current user (mock)");
  return Promise.resolve(mockUsers['user-1']); // Assuming user-1 is logged in
};

/**
 * Fetches a user's public profile by their username.
 * @param username The username of the profile to fetch.
 * @returns A promise that resolves with the User object.
 */
export const getUserByUsername = (username: string): Promise<User> => {
    console.log(`Fetching profile for username: ${username} (mock)`);
    const user = Object.values(mockUsers).find(u => u.username === username);
    if (user) {
        return Promise.resolve(user);
    }
    // A special case for the logged-in user's own profile link
    if (username === 'me') {
        return Promise.resolve(mockUsers['user-1']);
    }
    return Promise.reject(new Error('User not found'));
}


/**
 * Updates the user's profile on the server.
 * @param profileData - The profile data to update.
 * @returns A promise that resolves with the updated profile.
 */
export const updateUserProfile = (profileData: Partial<Omit<User, 'profile'>> & { profile?: Partial<Profile> }): Promise<Profile> => {
  // In a real app, this would be an API call:
  // return http.post<Profile>('/api/users/me/profile', profileData);
  
  const currentUser = mockUsers['user-1'];
  
  // Update top-level fields like fullName
  if (profileData.fullName) currentUser.fullName = profileData.fullName;
  
  // Update nested profile fields
  if (profileData.profile) {
      currentUser.profile = {
          ...currentUser.profile!,
          ...profileData.profile,
      };
  }

  console.log("Updated user profile (mock):", currentUser);
  
  return Promise.resolve(currentUser.profile!);
};