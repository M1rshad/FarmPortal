import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../config/firebase';
import { Box, CircularProgress } from '@mui/material';

const AdminRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#1a1a1a">
        <CircularProgress color="error" />
      </Box>
    );
  }

  // If not logged in, redirect to Admin Login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If logged in, render the dashboard
  return children;
};

export default AdminRoute;
