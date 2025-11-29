import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../config/firebase';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children, type = 'user' }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const { loading } = useAuth();

  useEffect(() => {
    if (type === 'admin') {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setAdminUser(currentUser);
        setAdminLoading(false);
      });
      return () => unsubscribe();
    }
  }, [type]);

  // --- 1. ADMIN CHECK ---
  if (type === 'admin') {
    if (adminLoading) return <Box height="100vh" display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Box>;
    if (adminUser) return <Navigate to="/admin/dashboard" replace />;
    return children;
  }

  // --- 2. APP USER CHECK (Direct Storage Look-up) ---
  // We check localStorage directly to bypass any React state delays.
  const apiKey = localStorage.getItem('api_key');
  const apiSecret = localStorage.getItem('api_secret');
  const hasKeys = !!(apiKey && apiSecret);

  // If keys exist, user is effectively logged in. Redirect immediately.
  if (hasKeys) {
    return <Navigate to="/" replace />;
  }

  // If keys don't exist but context says loading (e.g. clearing old session), wait.
  if (loading) {
    return <Box height="100vh" display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Box>;
  }

  // No keys, not loading -> Show Login Page
  return children;
};

export default PublicRoute;
