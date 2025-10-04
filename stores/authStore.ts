
import { create } from 'zustand';
import { User, Profile } from '../types';
import * as authService from '../services/authService';
import { queryClient } from '../lib/queryClient';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  actions: {
    setUser: (user: User | null) => void;
    setStatus: (status: AuthStatus) => void;
    updateUser: (updates: Partial<User & { profile: Partial<Profile> }>) => void;
    logout: () => Promise<void>;
  };
}

const initialState = {
  user: null,
  status: 'loading' as AuthStatus,
};

export const authStore = create<AuthState>((set) => ({
  ...initialState,
  actions: {
    setUser: (user: User | null) => set({ user }),
    setStatus: (status: AuthStatus) => set({ status }),
    updateUser: (updates: Partial<User & { profile: Partial<Profile> }>) =>
      set((state) => {
        if (!state.user) {
          return {};
        }
        const updatedUser: User = {
          ...state.user,
          ...updates,
          profile: {
            ...(state.user.profile || {} as Profile),
            ...updates.profile,
          },
        };
        return { user: updatedUser };
      }),
    logout: async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed on server:", error);
            // We proceed with client-side logout regardless of server success
        } finally {
            set({ user: null, status: 'unauthenticated' });
            // Clear all React Query cache to ensure no stale data from the previous session.
            queryClient.clear();
        }
    },
  },
}));

// --- Granular Hooks for Performance ---

/**
 * Hook to select the entire user object.
 * Components using this will re-render when user data changes.
 */
export const useUser = () => authStore(state => state.user);

/**
 * Hook to select only the authentication status.
 * Components using this will only re-render when the status ('loading', 'authenticated', 'unauthenticated') changes.
 */
export const useAuthStatus = () => authStore(state => state.status);

/**
 * Hook to select only the actions.
 * This hook will not cause re-renders when state changes, as actions are stable.
 */
export const useAuthActions = () => authStore(state => state.actions);