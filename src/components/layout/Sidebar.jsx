import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MedicalServices as DoctorsIcon,
  Person as PatientsIcon,
  EventNote as AppointmentsIcon,
  LocalPharmacy as PharmacyIcon,
  Biotech as LabReportsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  LocalHospital as HospitalIcon,
  Bed as BedIcon,
  MedicalInformation as MedicalInfoIcon,
  People as StaffIcon,
  AttachMoney as FinanceIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [patientSubmenuOpen, setPatientSubmenuOpen] = React.useState(false);

  // Navigation items
  const mainNavItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon color="primary" /> },
    { text: 'Doctors', path: '/doctors', icon: <DoctorsIcon color="primary" /> },
    { text: 'Staff Dashboard', path: '/staff/dashboard', icon: <StaffIcon color="primary" /> },
    { text: 'Financial Dashboard', path: '/financial/dashboard', icon: <FinanceIcon color="primary" /> },
  ];
  
  // Patient management items
  const patientItems = [
    { text: 'Patients List', path: '/patients', icon: <PatientsIcon color="primary" /> },
    { text: 'Admissions', path: '/admissions', icon: <BedIcon color="primary" /> },
    { text: 'Medical Records', path: '/medical-records', icon: <MedicalInfoIcon color="primary" /> }
  ];
  
  const serviceItems = [
    { text: 'Appointments', path: '/appointments', icon: <AppointmentsIcon color="primary" /> },
    { text: 'Pharmacy', path: '/pharmacy', icon: <PharmacyIcon color="primary" /> },
    { text: 'Lab Reports', path: '/lab-reports', icon: <LabReportsIcon color="primary" /> },
  ];

  const secondaryNavItems = [
    { text: 'Settings', path: '/settings', icon: <SettingsIcon color="primary" /> },
  ];

  // Check if path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Check if any subpath is active
  const isSubGroupActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  // Toggle patient submenu
  const handlePatientSubmenuToggle = () => {
    setPatientSubmenuOpen(!patientSubmenuOpen);
  };

  // Render navigation items
  const renderNavItems = (items) => {
    return items.map((item) => (
      <ListItem key={item.text} disablePadding>
        <ListItemButton
          onClick={() => navigate(item.path)}
          selected={isActive(item.path)}
          sx={{
            minHeight: 48,
            borderRadius: 1,
            m: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ));
  };

  return (
    <Drawer
      variant="persistent"
      open={isSidebarOpen}
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {renderNavItems(mainNavItems)}
          
          {/* Patient Management Section */}
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handlePatientSubmenuToggle}
              selected={isSubGroupActive(['/patients', '/admissions', '/medical-records'])}
              sx={{
                minHeight: 48,
                borderRadius: 1,
                m: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <ListItemIcon><HospitalIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Patient Management" />
              {patientSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={patientSubmenuOpen || isSubGroupActive(['/patients', '/admissions', '/medical-records'])} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {patientItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isActive(item.path)}
                    sx={{
                      minHeight: 48,
                      borderRadius: 1,
                      m: 0.5,
                      pl: 4,
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
        
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" sx={{ px: 3, color: 'text.secondary' }}>
          SERVICES
        </Typography>
        <List>{renderNavItems(serviceItems)}</List>
        
        <Divider sx={{ my: 2 }} />
        <List>{renderNavItems(secondaryNavItems)}</List>
      </Box>
    </Drawer>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func
};

export default Sidebar; 