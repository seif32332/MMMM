import { User } from '../types';
import { http } from './api';

// Simple in-memory store for users registered during the current session
const newMockUsers: Record<string, User> = {};

/**
 * Defines the successful response structure from the auth API.
 * The token is handled via HttpOnly cookies and is not part of the response body.
 */
interface AuthResponse {
  user: User;
}

/**
 * Registers a new user with an unverified email status.
 * In a real app, this would trigger a verification email.
 * @returns A promise that resolves indicating success.
 */
export const register = async (email: string, password: string): Promise<{ success: boolean }> => {
  if (Object.values(newMockUsers).some(u => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }

  const userId = `user-${Date.now()}`;
  const newUser: User = {
    id: userId,
    email,
    emailVerified: false, // <-- Key change: new users are not verified
    profile: {
      primaryRole: null as any,
    }
  };
  newMockUsers[userId] = newUser;
  // Log a mock verification link to the console for testing purposes
  console.log(`Mock Registration: User ${email} created. Verification link: /auth/verify-email?token=${btoa(email)}`);
  return { success: true };
};


/**
 * Logs in a user. The backend will set HttpOnly cookies for the session.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with the user object.
 */
export const login = async (email: string, password: string): Promise<User> => {
    const response = await http.post<AuthResponse>('/api/auth/login', { email, password });
    return response.user;
};

/**
 * Refreshes the user's session. This is typically called automatically by the API client
 * when a 401 error is encountered.
 * @returns A promise that resolves if the refresh is successful.
 */
export const refresh = (): Promise<void> => {
  return http.post<void>('/api/auth/refresh', {});
};

/**
 * Logs the user out by invalidating the session on the server side.
 * @returns A promise that resolves when the logout is complete.
 */
export const logout = (): Promise<void> => {
    return http.post<void>('/api/auth/logout', {});
};

/**
 * Verifies a user's email using a token.
 * In this mock, the token is the base64 encoded email.
 * @returns The updated user object.
 */
export const verifyEmail = async (token: string): Promise<User> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate delay
    try {
        const email = atob(token);
        // Check both the static mock users and newly registered ones
        const user = Object.values(newMockUsers).find(u => u.email === email);
        if (user) {
            user.emailVerified = true;
            console.log(`Mock Verification: Email for ${email} verified successfully.`);
            // This would also log the user in by setting the session cookie on the backend
            return user;
        } else {
            throw new Error("User not found for this token.");
        }
    } catch (e) {
        throw new Error("Invalid verification token.");
    }
};

/**
 * Simulates resending a verification email.
 */
export const resendVerificationEmail = async (email: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate delay
    console.log(`Mock Resend Verification: Sent to ${email}. Verification link: /auth/verify-email?token=${btoa(email)}`);
    return Promise.resolve();
};