import { useQuery } from '@tanstack/react-query';
import * as userService from '../services/userService';
import { User } from '../types';

export const useMe = () =>
  useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: userService.getCurrentUser,
  });
