import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: Role;
}
export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location
        }}
        replace />);


  }
  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return <>{children}</>;
}