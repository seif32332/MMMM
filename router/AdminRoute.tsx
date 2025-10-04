import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../stores/authStore';

/**
 * A route guard for admin-only pages.
 * It will check if the user has the 'ADMIN' system role.
 */
export const AdminRoute: React.FC = () => {
  const user = useUser();

  // TODO: Implement role-based access control.
  // When the backend provides the `systemRole`, this check will be enabled.
  // For now, it's a placeholder.
  const isAdmin = user?.systemRole === 'ADMIN';
  
  // if (!isAdmin) {
  //   // Redirect non-admins to a "Forbidden" page or the dashboard.
  //   return <Navigate to="/dashboard" replace />;
  // }

  // If the user is an admin, render the nested admin routes.
  return <Outlet />;
};