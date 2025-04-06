import React from 'react';
import { Container, Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppointmentForm from '../../components/appointments/AppointmentForm';

const AddAppointmentPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    // Navigate to appointments list after successful creation
    navigate('/appointments');
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/appointments" underline="hover" color="inherit">
            Appointments
          </Link>
          <Typography color="text.primary">Add New</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Add Appointment
        </Typography>
        
        <Paper elevation={0} sx={{ p: 0 }}>
          <AppointmentForm onSuccess={handleSuccess} mode="add" />
        </Paper>
      </Box>
    </Container>
  );
};

export default AddAppointmentPage; 