import { User, UserPrimaryRole, Deal, Job, Suggestion } from '../types';
import { getAllUsers } from './userService';
import { getDeals } from './dealService';
import { getJobs } from './jobService';

// A simple utility to find common elements between two arrays
const getIntersection = (arr1: string[] = [], arr2: string[] = []) => {
    return arr1.filter(value => arr2.includes(value));
}

/**
 * Scores the match between an investor and a deal.
 */
const scoreInvestorDealMatch = (investor: User, deal: Deal): { score: number; reason: string } => {
    let score = 0;
    const reasons: string[] = [];

    const investorPrefs = investor.profile?.onboardingDetails || {};
    
    // 1. Sector/Industry Match (High importance)
    const matchingSectors = getIntersection(investorPrefs.sectors, [deal.industry]);
    if (matchingSectors.length > 0) {
        score += 50 * matchingSectors.length;
        reasons.push(`Matches interest in ${matchingSectors.join(', ')}`);
    }

    // 2. Stage Match
    if (investorPrefs.stages?.includes(deal.stage.toLowerCase())) {
        score += 30;
        reasons.push(`Matches preferred ${deal.stage} stage`);
    }

    // 3. Funding Amount Match
    const dealAverageAmount = (deal.amountMin + deal.amountMax) / 2;
    if (
        dealAverageAmount >= (investorPrefs.ticketMin || 0) &&
        dealAverageAmount <= (investorPrefs.ticketMax || Infinity)
    ) {
        score += 20;
        reasons.push('Funding range is a fit');
    }

    return { score, reason: reasons.join(' · ') || 'General interest match' };
};

/**
 * Generates a list of suggested opportunities and connections for a given user.
 * This is a simplified "AI-lite" matching engine.
 */
export const getSuggestionsForUser = async (user: User): Promise<Suggestion[]> => {
    const allUsers = await getAllUsers();
    const allDeals = await getDeals();
    const allJobs = await getJobs();

    let suggestions: Suggestion[] = [];

    switch (user.profile?.primaryRole) {
        case UserPrimaryRole.INVESTOR:
            // Suggest deals that match the investor's profile
            allDeals.forEach(deal => {
                const { score, reason } = scoreInvestorDealMatch(user, deal);
                if (score > 0) {
                    suggestions.push({
                        type: 'DEAL',
                        id: deal.id,
                        data: deal,
                        score,
                        reason
                    });
                }
            });
            break;
            
        case UserPrimaryRole.FOUNDER:
            // Suggest investors that match the founder's deal/needs
            const investors = allUsers.filter(u => u.profile?.primaryRole === UserPrimaryRole.INVESTOR && u.id !== user.id);
            investors.forEach(investor => {
                // For simplicity, we'll create a "pseudo-deal" from the founder's needs
                const founderNeedsAsDeal: Deal = {
                    id: 'temp',
                    title: '',
                    summary: '',
                    owner: user,
                    createdAt: '',
                    industry: (user.profile?.onboardingDetails?.sectors || [])[0] || '',
                    stage: user.profile?.onboardingDetails?.stage || '',
                    amountMin: user.profile?.onboardingDetails?.amountMin || 0,
                    amountMax: user.profile?.onboardingDetails?.amountMax || 0,
                    country: user.profile?.location || '',
                };
                const { score, reason } = scoreInvestorDealMatch(investor, founderNeedsAsDeal);
                if (score > 0) {
                     suggestions.push({
                        type: 'USER',
                        id: investor.id,
                        data: investor,
                        score,
                        reason
                    });
                }
            });
            break;

        // TODO: Implement JOB_SEEKER matching logic
    }
    
    // Sort by score descending
    return suggestions.sort((a, b) => b.score - a.score);
};