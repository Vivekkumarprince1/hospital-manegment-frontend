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
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format, parseISO, parse, set } from 'date-fns';

// Services
import * as appointmentService from '../../services/appointmentService';
import * as doctorService from '../../services/doctorService';
import * as patientService from '../../services/patientService';
import * as authService from '../../services/authService';

const validationSchema = Yup.object({
  patientId: Yup.string().required('Patient is required'),
  doctorId: Yup.string().required('Doctor is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
  reason: Yup.string().required('Reason is required'),
  status: Yup.string().required('Status is required')
});

const appointmentTypes = [
  'Consultation',
  'Follow-up',
  'Check-up',
  'Emergency',
  'Surgery Consultation',
  'Vaccination',
  'Lab Test',
  'Physical Therapy',
  'Dental',
  'Eye Test'
];

const statusOptions = [
  'Scheduled',
  'Confirmed',
  'Completed',
  'Cancelled',
  'No-show'
];

const AppointmentForm = ({ appointment, onSuccess, mode = 'add' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
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

  // Convert time string to Date object
  const parseTimeString = (timeStr) => {
    if (!timeStr) return new Date();
    try {
      return parse(timeStr, 'HH:mm', new Date());
    } catch (err) {
      console.error('Error parsing time:', err);
      return new Date();
    }
  };

  // Initial form values
  const initialValues = {
    patientId: appointment?.patientId || '',
    doctorId: appointment?.doctorId || '',
    date: appointment?.date ? parseISO(appointment.date) : new Date(),
    time: appointment?.time || '10:00',
    reason: appointment?.reason || '',
    type: appointment?.type || appointmentTypes[0],
    status: appointment?.status || 'Scheduled',
    notes: appointment?.notes || ''
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDoctors(true);
        setLoadingPatients(true);
        
        // Fetch doctors
        const doctorsData = await doctorService.getAllDoctors(1, 100);
        setDoctors(doctorsData.doctors || []);
        
        // Fetch patients
        const patientsData = await patientService.getAllPatients(1, 100);
        setPatients(patientsData.patients || []);
      } catch (err) {
        console.error('Error fetching data for appointment form:', err);
        setError('Failed to load doctors and patients data');
      } finally {
        setLoadingDoctors(false);
        setLoadingPatients(false);
      }
    };

    fetchData();
  }, []);

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

      // Format data for API
      const appointmentData = {
        ...values,
        date: values.date ? format(values.date, 'yyyy-MM-dd') : null,
        // Ensure time is in HH:mm format
        time: typeof values.time === 'string' 
          ? values.time 
          : format(values.time, 'HH:mm')
      };

      console.log('Submitting appointment data:', appointmentData);

      // Call the appropriate service method based on mode
      let response;
      if (mode === 'edit' && appointment?._id) {
        response = await appointmentService.updateAppointment(appointment._id, appointmentData);
        setSuccess('Appointment updated successfully');
      } else {
        response = await appointmentService.createAppointment(appointmentData);
        setSuccess('Appointment created successfully');
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
      console.error('Error submitting appointment:', err);
      
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
        setError('An error occurred while saving the appointment. Please try again.');
      }
      
      setLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
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
                <FormControl 
                  fullWidth 
                  error={touched.patientId && Boolean(errors.patientId)}
                  disabled={loadingPatients}
                >
                  <InputLabel id="patient-label">Patient</InputLabel>
                  <Field
                    as={Select}
                    name="patientId"
                    labelId="patient-label"
                    label="Patient"
                  >
                    {loadingPatients ? (
                      <MenuItem disabled>Loading patients...</MenuItem>
                    ) : (
                      patients.map((patient) => (
                        <MenuItem key={patient._id || patient.id} value={patient._id || patient.id}>
                          {patient.name}
                        </MenuItem>
                      ))
                    )}
                  </Field>
                  {touched.patientId && errors.patientId && (
                    <FormHelperText>{errors.patientId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl 
                  fullWidth 
                  error={touched.doctorId && Boolean(errors.doctorId)}
                  disabled={loadingDoctors}
                >
                  <InputLabel id="doctor-label">Doctor</InputLabel>
                  <Field
                    as={Select}
                    name="doctorId"
                    labelId="doctor-label"
                    label="Doctor"
                  >
                    {loadingDoctors ? (
                      <MenuItem disabled>Loading doctors...</MenuItem>
                    ) : (
                      doctors.map((doctor) => (
                        <MenuItem key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </MenuItem>
                      ))
                    )}
                  </Field>
                  {touched.doctorId && errors.doctorId && (
                    <FormHelperText>{errors.doctorId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={values.date}
                    onChange={(newValue) => {
                      setFieldValue('date', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        name="date"
                        error={touched.date && Boolean(errors.date)}
                        helperText={touched.date && errors.date}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Time"
                    value={parseTimeString(values.time)}
                    onChange={(newValue) => {
                      setFieldValue('time', format(newValue, 'HH:mm'));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        name="time"
                        error={touched.time && Boolean(errors.time)}
                        helperText={touched.time && errors.time}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={touched.type && Boolean(errors.type)}
                >
                  <InputLabel id="type-label">Appointment Type</InputLabel>
                  <Field
                    as={Select}
                    name="type"
                    labelId="type-label"
                    label="Appointment Type"
                  >
                    {appointmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.type && errors.type && (
                    <FormHelperText>{errors.type}</FormHelperText>
                  )}
                </FormControl>
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
                    {statusOptions.map((statusOption) => (
                      <MenuItem key={statusOption} value={statusOption}>
                        {statusOption}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.status && errors.status && (
                    <FormHelperText>{errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="reason"
                  label="Reason for Visit"
                  fullWidth
                  multiline
                  rows={2}
                  error={touched.reason && Boolean(errors.reason)}
                  helperText={touched.reason && errors.reason}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="notes"
                  label="Additional Notes"
                  fullWidth
                  multiline
                  rows={4}
                  error={touched.notes && Boolean(errors.notes)}
                  helperText={touched.notes && errors.notes}
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
                      'Update Appointment'
                    ) : (
                      'Add Appointment'
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

AppointmentForm.propTypes = {
  appointment: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit'])
};

export default AppointmentForm; 
 