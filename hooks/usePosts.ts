import { useQuery } from '@tanstack/react-query';
import * as postService from '../services/postService';
import { Post } from '../types';

export const usePosts = (userId?: string) =>
  useQuery<Post[], Error>({
    queryKey: ['posts', userId || 'all'],
    queryFn: () => postService.getPosts({ userId }),
  });