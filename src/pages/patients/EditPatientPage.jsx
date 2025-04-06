import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Breadcrumbs, Link, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import PatientForm from '../../components/patients/PatientForm';
import * as patientService from '../../services/patientService';

const EditPatientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const data = await patientService.getPatientById(id);
        setPatient(data);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Failed to load patient data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  const handleSuccess = () => {
    // Navigate to patient details after successful update
    navigate(`/patients/${id}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/patients" underline="hover" color="inherit">
            Patients
          </Link>
          <Typography color="text.primary">Edit Patient</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Patient
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : patient ? (
          <Paper elevation={0} sx={{ p: 0 }}>
            <PatientForm 
              patient={patient} 
              onSuccess={handleSuccess} 
              mode="edit" 
            />
          </Paper>
        ) : (
          <Alert severity="error" sx={{ mb: 3 }}>
            Patient not found
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default EditPatientPage; 