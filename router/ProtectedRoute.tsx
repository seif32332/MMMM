import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../stores/authStore';
import { Spinner } from '../components/ui/Spinner';

export const ProtectedRoute: React.FC = () => {
  const status = useAuthStatus();

  if (status === 'loading') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};