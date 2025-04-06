import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Breadcrumbs, Link, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import * as appointmentService from '../../services/appointmentService';

const EditAppointmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const data = await appointmentService.getAppointmentById(id);
        setAppointment(data);
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError('Failed to load appointment data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const handleSuccess = () => {
    // Navigate to appointment details after successful update
    navigate(`/appointments/${id}`);
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
          <Typography color="text.primary">Edit Appointment</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Appointment
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : appointment ? (
          <Paper elevation={0} sx={{ p: 0 }}>
            <AppointmentForm 
              appointment={appointment} 
              onSuccess={handleSuccess} 
              mode="edit" 
            />
          </Paper>
        ) : (
          <Alert severity="error" sx={{ mb: 3 }}>
            Appointment not found
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default EditAppointmentPage; 