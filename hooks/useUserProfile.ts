import { useQuery } from '@tanstack/react-query';
import * as userService from '../services/userService';
import { User } from '../types';

/**
 * A hook to fetch a user's public profile data by their username.
 * @param username The username of the user to fetch.
 */
export const useUserProfile = (username: string | undefined) =>
  useQuery<User, Error>({
    queryKey: ['userProfile', username],
    queryFn: () => {
      if (!username) {
        throw new Error('Username is required to fetch a profile.');
      }
      return userService.getUserByUsername(username);
    },
    enabled: !!username, // The query will not run until the username is available
  });