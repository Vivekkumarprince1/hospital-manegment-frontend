import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Chip,
  Typography,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import * as doctorService from '../../services/doctorService';

const specializations = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Ophthalmology',
  'Gynecology',
  'Oncology',
  'Urology',
  'Psychiatry',
  'Radiology',
  'General Surgery'
];

// Create validation schema with Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  specialization: Yup.string().required('Specialization is required'),
  experience: Yup.number().typeError('Experience must be a number').min(0, 'Experience must be at least 0 years'),
  qualifications: Yup.string().required('Qualifications are required'),
  address: Yup.string(),
  availableHours: Yup.string(),
  photo: Yup.string()
});

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const DoctorForm = ({ doctor, onSuccess, mode = 'add' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDays, setSelectedDays] = useState(doctor?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

  // Initial form values
  const initialValues = {
    name: doctor?.name || '',
    email: doctor?.email || '',
    specialization: doctor?.specialization || '',
    experience: doctor?.experience || 0,
    qualifications: doctor?.qualifications || '',
    phone: doctor?.phone || '',
    address: doctor?.address || '',
    availableHours: doctor?.availableHours || '9:00 AM - 5:00 PM',
    photo: doctor?.photo || ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare data for API
      const doctorData = {
        ...values,
        availableDays: selectedDays
      };

      // Call the appropriate service method based on mode
      let response;
      if (mode === 'edit' && doctor?._id) {
        response = await doctorService.updateDoctor(doctor._id, doctorData);
      } else {
        response = await doctorService.createDoctor(doctorData);
      }

      // Reset form if it's add mode
      if (mode === 'add') {
        resetForm();
        setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
      }

      // Call the success callback passed from parent
      if (onSuccess && response) {
        onSuccess(response);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error saving doctor:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while saving the doctor. Please try again.');
      }
      setLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="name"
                  label="Doctor Name"
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
                <Field
                  as={TextField}
                  fullWidth
                  name="specialization"
                  label="Specialization"
                  error={touched.specialization && Boolean(errors.specialization)}
                  helperText={touched.specialization && errors.specialization}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="experience"
                  label="Experience (years)"
                  type="number"
                  error={touched.experience && Boolean(errors.experience)}
                  helperText={touched.experience && errors.experience}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="qualifications"
                  label="Qualifications"
                  error={touched.qualifications && Boolean(errors.qualifications)}
                  helperText={touched.qualifications && errors.qualifications}
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
              
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="availableHours"
                  label="Available Hours"
                  placeholder="e.g. 9:00 AM - 5:00 PM"
                  error={touched.availableHours && Boolean(errors.availableHours)}
                  helperText={touched.availableHours && errors.availableHours}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="photo"
                  label="Photo URL"
                  error={touched.photo && Boolean(errors.photo)}
                  helperText={touched.photo && errors.photo}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Available Days
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {daysOfWeek.map((day) => (
                    <Chip
                      key={day}
                      label={day}
                      onClick={() => handleDayToggle(day)}
                      color={selectedDays.includes(day) ? "primary" : "default"}
                      variant={selectedDays.includes(day) ? "filled" : "outlined"}
                    />
                  ))}
                </Box>
                {selectedDays.length === 0 && (
                  <FormHelperText error>Please select at least one day</FormHelperText>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || loading || selectedDays.length === 0}
                    sx={{ minWidth: 120 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : mode === 'edit' ? (
                      'Update Doctor'
                    ) : (
                      'Add Doctor'
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

DoctorForm.propTypes = {
  doctor: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit'])
};

export default DoctorForm; 
 