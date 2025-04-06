import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 5
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'primary.main', mb: 3 }} />
        
        <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 