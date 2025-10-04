import { QueryClient } from '@tanstack/react-query';

/**
 * A singleton instance of the QueryClient.
 *
 * It is configured with default options to provide a better development experience:
 * - `retry: 1`: Limits automatic retries on failed queries to 1, preventing excessive API calls.
 * - `staleTime: 60_000`: (1 minute) Data is considered fresh for one minute, preventing re-fetches.
 * - `refetchOnWindowFocus: false`: Prevents automatic re-fetching when the window regains focus.
 * - `mutations: { retry: 0 }`: Mutations will not be retried automatically on failure.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
