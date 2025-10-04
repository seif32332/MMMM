// In-memory store for follow relationships
// Key: followerId, Value: Set of followed user IDs
const mockFollows: Map<string, Set<string>> = new Map();

// Initial follow state for demonstration
mockFollows.set('user-1', new Set(['user-2']));

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Checks if a user is following another user.
 * @param viewerId The ID of the user performing the check.
 * @param targetId The ID of the user being checked.
 * @returns A promise that resolves with a boolean indicating the follow status.
 */
export const getFollowStatus = async (viewerId: string, targetId: string): Promise<boolean> => {
    await sleep(100);
    const followedSet = mockFollows.get(viewerId);
    return followedSet ? followedSet.has(targetId) : false;
};

/**
 * Follows a user.
 * @param viewerId The ID of the user initiating the follow.
 * @param targetId The ID of the user to follow.
 */
export const followUser = async (viewerId: string, targetId: string): Promise<void> => {
    await sleep(300);
    if (!mockFollows.has(viewerId)) {
        mockFollows.set(viewerId, new Set());
    }
    mockFollows.get(viewerId)!.add(targetId);
    console.log(`${viewerId} now follows ${targetId}. State:`, mockFollows);
};

/**
 * Unfollows a user.
 * @param viewerId The ID of the user initiating the unfollow.
 * @param targetId The ID of the user to unfollow.
 */
export const unfollowUser = async (viewerId: string, targetId: string): Promise<void> => {
    await sleep(300);
    const followedSet = mockFollows.get(viewerId);
    if (followedSet) {
        followedSet.delete(targetId);
    }
    console.log(`${viewerId} unfollowed ${targetId}. State:`, mockFollows);
};
