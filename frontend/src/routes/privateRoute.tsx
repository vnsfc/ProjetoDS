import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, UserPerfil } from '../stores/AuthStores';

interface PrivateRouteProps {
  allowedProfiles?: UserPerfil[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedProfiles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedProfiles && user && !allowedProfiles.includes(user.perfil)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};