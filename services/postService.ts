import { Post, User } from '../types';

// In-memory store for mock data
let mockPosts: Post[] = [
  {
    id: 'post-1',
    author: {
      id: 'user-2',
      fullName: 'Noor Al-Huda',
      username: 'noor',
      avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bandit'
    },
    body: 'Just closed a seed round for our new FinTech startup! Excited for what the future holds. #KSA #Vision2030',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    commentsCount: 5,
    reactionsCount: 22,
  },
  {
    id: 'post-2',
    author: {
        id: 'user-1', // Changed to user-1 for testing
        fullName: 'Faisal Al-Saud',
        username: 'faisal',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bear'
    },
    body: 'Looking for a Senior React Engineer to join our team in Riyadh. Must be proficient in TypeScript and GraphQL. DM for details. #hiring #jobs',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    commentsCount: 12,
    reactionsCount: 45,
  },
];

// Simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface GetPostsOptions {
  userId?: string;
}

/**
 * Fetches the list of posts.
 * @returns A promise that resolves with an array of posts.
 */
export const getPosts = async (options: GetPostsOptions = {}): Promise<Post[]> => {
  await sleep(500); // Simulate network latency
  
  let posts = [...mockPosts];

  if (options.userId) {
    posts = posts.filter(p => p.author.id === options.userId);
  }

  // Return posts sorted by newest first
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Creates a new post.
 * @param body - The content of the new post.
 * @param author - The author of the post.
 * @returns A promise that resolves with the newly created post.
 */
export const createPost = async (body: string, author: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'username'>): Promise<Post> => {
    await sleep(300);
    if (!body.trim()) {
        throw new Error("Post body cannot be empty.");
    }

    const newPost: Post = {
        id: `post-${Date.now()}`,
        author,
        body,
        createdAt: new Date().toISOString(),
        commentsCount: 0,
        reactionsCount: 0,
    };

    mockPosts.push(newPost);
    return newPost;
};