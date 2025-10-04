import { User } from '../types';
import { http } from './api';

/**
 * Defines the successful response structure from the auth API.
 * The token is handled via HttpOnly cookies and is not part of the response body.
 */
interface AuthResponse {
  user: User;
}

/**
 * Registers a new user. The backend will set HttpOnly cookies for the session.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with the user object.
 */
export const register = async (email: string, password: string): Promise<User> => {
  const response = await http.post<AuthResponse>('/api/auth/register', { email, password });
  return response.user;
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