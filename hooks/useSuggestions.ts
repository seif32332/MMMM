import { useQuery } from '@tanstack/react-query';
import * as matchingService from '../services/matchingService';
import { useUser } from '../stores/authStore';
import { Suggestion } from '../types';

/**
 * A hook to fetch AI-powered suggestions for the current user.
 * It's role-aware, meaning it will fetch different types of suggestions
 * based on the user's primary role.
 */
export const useSuggestions = () => {
  const user = useUser();
  const queryKey = ['suggestions', user?.id];

  return useQuery<Suggestion[], Error>({
    queryKey,
    queryFn: () => {
      if (!user) {
        throw new Error('User must be logged in to get suggestions.');
      }
      return matchingService.getSuggestionsForUser(user);
    },
    enabled: !!user && !!user.profile?.profileCompleted, // Only run if the user is logged in and has completed onboarding
  });
};