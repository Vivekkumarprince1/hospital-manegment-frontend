import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import PropTypes from 'prop-types';

const Layout = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        onLogout={onLogout}
      />
      
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          px: 2,
          pb: 2,
          overflow: 'auto',
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  onLogout: PropTypes.func.isRequired
};

export default Layout; 