import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Avatar,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout as LogoutIcon
} from '@mui/icons-material';
import * as authService from '../../services/authService';

const Header = ({ isSidebarOpen, toggleSidebar, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = () => {
      const userData = authService.getUser();
      setUser(userData);
    };

    fetchUserData();
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const isMenuOpen = Boolean(anchorEl);

  // Get first letter of user name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 1,
          backgroundColor: 'white',
          color: 'primary.main'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}
          >
            Hospital Management System
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Notifications */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {user && (
              <Chip
                label={user.role}
                color="primary"
                variant="outlined"
                sx={{ mx: 2, textTransform: 'capitalize' }}
              />
            )}
            
            {/* Profile */}
            <Tooltip title="Account settings">
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user ? getInitial(user.name) : <AccountCircle />}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Profile menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
          </Box>
        )}
        <MenuItem onClick={() => navigate('/profile')}>
          <Avatar sx={{ width: 24, height: 24, mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

Header.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Header; 
 