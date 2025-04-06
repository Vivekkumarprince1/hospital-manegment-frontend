import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Home = ({ isAuthenticated, isLoading }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on authentication state after a short delay
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, isLoading]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        Hospital Management System
      </Typography>
      
      <CircularProgress size={60} thickness={4} />
      
      <Typography variant="body1" sx={{ mt: 4 }}>
        {isLoading ? 'Loading...' : isAuthenticated ? 'Redirecting to Dashboard...' : 'Redirecting to Login...'}
      </Typography>
    </Box>
  );
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool
};

Home.defaultProps = {
  isAuthenticated: false,
  isLoading: true
};

export default Home; 
 