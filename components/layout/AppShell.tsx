import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthActions, useAuthStatus } from '../../stores/authStore';
import { useMe } from '../../hooks/useMe';
import { Spinner } from '../ui/Spinner';
import { Header } from '../Header';

/**
 * This component handles the initial authentication check by leveraging React Query.
 * It fetches the user and syncs the state with Zustand.
 */
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isSuccess, isError, isLoading } = useMe();
  const { setUser, setStatus } = useAuthActions();
  const status = useAuthStatus();

  useEffect(() => {
    if (isSuccess && user) {
      setUser(user);
      setStatus('authenticated');
    } else if (isError) {
      setStatus('unauthenticated');
    } else if (isLoading) {
      setStatus('loading');
    }
  }, [isSuccess, isError, isLoading, user, setUser, setStatus]);

  // While the initial fetch is happening, show a loading spinner.
  if (status === 'loading') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};


/**
 * The main layout for the authenticated part of the application.
 * It includes the Header, the AuthInitializer, and renders nested routes via <Outlet />.
 */
export const AppShell: React.FC = () => {
    return (
        <AuthInitializer>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main>
                    <Outlet />
                </main>
            </div>
        </AuthInitializer>
    )
}