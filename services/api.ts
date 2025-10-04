
import { authStore } from '../stores/authStore';

// Function to read a cookie by name. Used to get the CSRF token.
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// A variable to prevent an infinite loop of refresh attempts.
let isRefreshing = false;

async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const csrfToken = getCookie('csrf_token');
  if (csrfToken && options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Crucial for sending HttpOnly cookies
  };

  let response = await fetch(endpoint, config);

  if (response.status === 401 && !isRefreshing) {
    isRefreshing = true;
    try {
      // Dynamically import authService here to break the circular dependency
      const authService = await import('./authService');
      await authService.refresh(); // Attempt to refresh the session
      // If refresh is successful, retry the original request
      response = await fetch(endpoint, config);
    } catch (error) {
      // If refresh fails, log the user out
      console.error('Session refresh failed, logging out.');
      // Use the store's action to perform a clean logout
      authStore.getState().actions.logout();
      // Throw an error to stop the original request's promise chain
      throw new Error('Session expired. Please log in again.');
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    let errorMessage = `API error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (e) {
      // The response body was not JSON
    }
    throw new Error(errorMessage);
  }

  // Handle cases with no response body (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  return Promise.resolve(undefined as T);
}

// Helper methods for different HTTP verbs
export const http = {
  get: <T>(endpoint: string, options?: RequestInit) => api<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) => api<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: RequestInit) => api<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => api<T>(endpoint, { ...options, method: 'DELETE' }),
};