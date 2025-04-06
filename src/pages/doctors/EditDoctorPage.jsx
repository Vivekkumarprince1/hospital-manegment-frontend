import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Breadcrumbs, Link, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import DoctorForm from '../../components/doctors/DoctorForm';
import * as doctorService from '../../services/doctorService';

const EditDoctorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  const handleSuccess = () => {
    // Navigate to doctor details after successful update
    navigate(`/doctors/${id}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/doctors" underline="hover" color="inherit">
            Doctors
          </Link>
          <Typography color="text.primary">Edit Doctor</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Doctor
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : doctor ? (
          <Paper elevation={0} sx={{ p: 0 }}>
            <DoctorForm 
              doctor={doctor} 
              onSuccess={handleSuccess} 
              mode="edit" 
            />
          </Paper>
        ) : (
          <Alert severity="error" sx={{ mb: 3 }}>
            Doctor not found
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default EditDoctorPage; 