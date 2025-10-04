import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../stores/authStore';

/**
 * A route guard that prevents a user who has already completed onboarding from accessing
 * the onboarding pages again. If they have completed it, they are redirected to the dashboard.
 */
export const OnboardingInProgressGuard: React.FC = () => {
  const user = useUser();
  const isOnboardingComplete = user?.profile?.profileCompleted === true;

  if (isOnboardingComplete) {
    // Redirect to the dashboard if the user has already completed onboarding.
    return <Navigate to="/dashboard" replace />;
  }

  // If onboarding is not yet complete, allow access to the onboarding routes.
  return <Outlet />;
};