import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import * as authService from '../../services/authService';
import PropTypes from 'prop-types';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        if (isAuthenticated) {
          const userData = authService.getUser();
          setUser(userData);
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // If allowedRoles is provided and user's role is not in allowedRoles, redirect to dashboard
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute; 