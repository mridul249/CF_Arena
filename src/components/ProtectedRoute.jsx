import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Cookies from 'js-cookie';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  const location = useLocation();

  // Check cookie directly for immediate feedback before Context initializes
  const hasCookie = Cookies.get('cf_active_handle');

  // If there's no cookie and no user, redirect to login
  if (!hasCookie && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
