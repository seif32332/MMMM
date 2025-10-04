import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../stores/authStore';

/**
 * A route guard that ensures the user has completed the onboarding process.
 * If `user.profile.profileCompleted` is not true, it redirects to the start of the onboarding flow.
 * This protects the main parts of the application (like the dashboard) from being accessed prematurely.
 */
export const OnboardingCompleteGuard: React.FC = () => {
  const user = useUser();
  const isOnboardingComplete = user?.profile?.profileCompleted === true;

  if (!isOnboardingComplete) {
    // Redirect to the first step of onboarding if the profile is not complete.
    return <Navigate to="/onboarding/role" replace />;
  }

  // If onboarding is complete, render the nested routes.
  return <Outlet />;
};