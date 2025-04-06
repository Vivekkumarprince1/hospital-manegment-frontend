import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Grid,
  MenuItem,
  Paper,
  Typography,
  CircularProgress,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parseISO, differenceInYears } from 'date-fns';
import * as patientService from '../../services/patientService';
import * as authService from '../../services/authService';

// Create validation schema with Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  gender: Yup.string().required('Gender is required'),
  bloodGroup: Yup.string().required('Blood group is required'),
  address: Yup.string(),
  dateOfBirth: Yup.date().nullable().required('Date of birth is required'),
  age: Yup.number().typeError('Age must be a number').positive('Age must be positive').required('Age is required'),
  medicalHistory: Yup.string(),
  status: Yup.string().required('Status is required')
});

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['Male', 'Female', 'Other'];
const statuses = ['Active', 'Inactive'];

const PatientForm = ({ patient, onSuccess, mode = 'add' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (!isAuth) {
        setError('You must be logged in to perform this action');
      }
    };
    
    checkAuth();
  }, []);

  // Calculate initial age from date of birth if available
  const calculateAge = (dob) => {
    if (!dob) return '';
    return differenceInYears(new Date(), new Date(dob));
  };

  // Initial form values
  const initialValues = {
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    gender: patient?.gender || '',
    bloodGroup: patient?.bloodGroup || '',
    address: patient?.address || '',
    dateOfBirth: patient?.dateOfBirth ? parseISO(patient.dateOfBirth) : null,
    age: patient?.age || (patient?.dateOfBirth ? calculateAge(patient.dateOfBirth) : ''),
    medicalHistory: patient?.medicalHistory || '',
    status: patient?.status || 'Active',
    emergencyContact: patient?.emergencyContact || {
      name: '',
      relationship: '',
      phone: ''
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!isAuthenticated) {
        setError('You must be logged in to perform this action');
        setSubmitting(false);
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(null);

      // Format date of birth to ISO string
      const patientData = {
        ...values,
        dateOfBirth: values.dateOfBirth ? format(values.dateOfBirth, 'yyyy-MM-dd') : null,
        registeredDate: new Date().toISOString().split('T')[0]
      };

      // Call the appropriate service method based on mode
      let response;
      if (mode === 'edit' && patient?._id) {
        response = await patientService.updatePatient(patient._id, patientData);
        setSuccess('Patient updated successfully');
      } else {
        response = await patientService.createPatient(patientData);
        setSuccess('Patient created successfully');
      }

      // Reset form if it's add mode
      if (mode === 'add') {
        resetForm();
      }

      // Call the success callback passed from parent
      if (onSuccess && response) {
        onSuccess(response);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error saving patient:', err);
      
      if (err.response) {
        // Handle error from server
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.status === 401) {
          setError('Authentication error: Please log in again');
        } else {
          setError(`Server error (${err.response.status}): Please try again`);
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An error occurred while saving the patient. Please try again.');
      }
      
      setLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="name"
                  label="Patient Name"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label="Email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl 
                  fullWidth 
                  error={touched.gender && Boolean(errors.gender)}
                >
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Field
                    as={Select}
                    name="gender"
                    labelId="gender-label"
                    label="Gender"
                  >
                    {genders.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.gender && errors.gender && (
                    <FormHelperText>{errors.gender}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl 
                  fullWidth 
                  error={touched.bloodGroup && Boolean(errors.bloodGroup)}
                >
                  <InputLabel id="bloodGroup-label">Blood Group</InputLabel>
                  <Field
                    as={Select}
                    name="bloodGroup"
                    labelId="bloodGroup-label"
                    label="Blood Group"
                  >
                    {bloodGroups.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.bloodGroup && errors.bloodGroup && (
                    <FormHelperText>{errors.bloodGroup}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={values.dateOfBirth}
                    onChange={(newValue) => {
                      setFieldValue('dateOfBirth', newValue);
                      // Automatically calculate and update age when date of birth changes
                      if (newValue) {
                        const age = differenceInYears(new Date(), newValue);
                        setFieldValue('age', age);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        name="dateOfBirth"
                        error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                        helperText={touched.dateOfBirth && errors.dateOfBirth}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="age"
                  label="Age"
                  type="number"
                  inputProps={{ min: 0 }}
                  error={touched.age && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl 
                  fullWidth 
                  error={touched.status && Boolean(errors.status)}
                >
                  <InputLabel id="status-label">Status</InputLabel>
                  <Field
                    as={Select}
                    name="status"
                    labelId="status-label"
                    label="Status"
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.status && errors.status && (
                    <FormHelperText>{errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Emergency Contact
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Field
                  as={TextField}
                  fullWidth
                  name="emergencyContact.name"
                  label="Contact Name"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Field
                  as={TextField}
                  fullWidth
                  name="emergencyContact.relationship"
                  label="Relationship"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Field
                  as={TextField}
                  fullWidth
                  name="emergencyContact.phone"
                  label="Contact Phone"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="address"
                  label="Address"
                  multiline
                  rows={2}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="medicalHistory"
                  label="Medical History"
                  multiline
                  rows={4}
                  error={touched.medicalHistory && Boolean(errors.medicalHistory)}
                  helperText={touched.medicalHistory && errors.medicalHistory}
                  placeholder="Include any relevant medical history, allergies, or pre-existing conditions"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || loading || !isAuthenticated}
                    sx={{ minWidth: 120 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : mode === 'edit' ? (
                      'Update Patient'
                    ) : (
                      'Add Patient'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

PatientForm.propTypes = {
  patient: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit'])
};

export default PatientForm; 
 