import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import * as postService from '../services/postService';
import { useUser } from '../stores/authStore';
import { Post } from '../types';

type CreatePostPayload = string; // The body of the post

type UseCreatePostOptions = Omit<UseMutationOptions<Post, Error, CreatePostPayload>, 'mutationFn'>;

export const useCreatePost = (options?: UseCreatePostOptions) => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation<Post, Error, CreatePostPayload>({
    ...options,
    mutationFn: (body) => {
      if (!user) {
        throw new Error('User must be logged in to post.');
      }
      const author = {
          id: user.id,
          fullName: user.fullName || 'Anonymous',
          username: user.username || 'anonymous',
          avatarUrl: user.avatarUrl,
      };
      return postService.createPost(body, author);
    },
    onSuccess: (newPost, variables, context, mutation) => {
      // Invalidate the 'posts' query to refetch the list including the new post.
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Call original onSuccess if provided
      options?.onSuccess?.(newPost, variables, context, mutation);
    },
  });
};