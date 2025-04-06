import React from 'react';
import { Container, Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DoctorForm from '../../components/doctors/DoctorForm';

const AddDoctorPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    // Navigate to doctors list after successful creation
    navigate('/doctors');
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
          <Typography color="text.primary">Add New</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Add Doctor
        </Typography>
        
        <Paper elevation={0} sx={{ p: 0 }}>
          <DoctorForm onSuccess={handleSuccess} mode="add" />
        </Paper>
      </Box>
    </Container>
  );
};

export default AddDoctorPage; 