import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuthStore();
  const location = useLocation();

  if (!token) {
    // Redirect to login page with the current location as the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 