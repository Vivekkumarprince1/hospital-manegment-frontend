import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Stack
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import * as labService from '../../services/labService';
import { LAB_TEST_TYPES } from '../../config/constants';

const validationSchema = yup.object({
  patientName: yup.string().required('Patient name is required'),
  patientId: yup.string().required('Patient ID is required'),
  doctorName: yup.string().required('Doctor name is required'),
  doctorId: yup.string().required('Doctor ID is required'),
  testType: yup.string().required('Test type is required'),
  testDate: yup.date().required('Test date is required'),
  status: yup.string().required('Status is required'),
  results: yup.string(),
  normalRanges: yup.string(),
  observations: yup.string(),
  conclusion: yup.string(),
});

const LabReportForm = ({ labReport, onSuccess, mode = 'add' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  useEffect(() => {
    // Load patients and doctors for dropdowns
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // For now, using mock data or placeholder
        setPatients([
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Smith' },
          { id: '3', name: 'Robert Johnson' }
        ]);
        
        setDoctors([
          { id: '1', name: 'Dr. Smith' },
          { id: '2', name: 'Dr. Jones' },
          { id: '3', name: 'Dr. Williams' }
        ]);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data. Please try again.');
      }
    };
    
    fetchData();
  }, []);

  const initialValues = {
    patientName: labReport?.patientName || '',
    patientId: labReport?.patientId || '',
    doctorName: labReport?.doctorName || '',
    doctorId: labReport?.doctorId || '',
    testType: labReport?.testType || '',
    testDate: labReport?.testDate ? new Date(labReport.testDate) : new Date(),
    reportDate: labReport?.reportDate ? new Date(labReport.reportDate) : null,
    status: labReport?.status || 'pending',
    results: labReport?.results || '',
    normalRanges: labReport?.normalRanges || '',
    observations: labReport?.observations || '',
    conclusion: labReport?.conclusion || '',
    attachmentUrl: labReport?.attachmentUrl || '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        const formattedValues = {
          ...values,
          testDate: values.testDate?.toISOString().split('T')[0],
          reportDate: values.reportDate ? values.reportDate.toISOString().split('T')[0] : null,
        };

        let response;
        if (mode === 'add') {
          response = await labService.createLabReport(formattedValues);
        } else {
          response = await labService.updateLabReport(labReport.id, formattedValues);
        }

        if (response) {
          onSuccess(response);
        }
      } catch (err) {
        console.error('Error saving lab report:', err);
        setError(err.message || 'Failed to save lab report. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handlePatientChange = (event) => {
    const patientId = event.target.value;
    const selectedPatient = patients.find(p => p.id === patientId);
    if (selectedPatient) {
      formik.setFieldValue('patientId', patientId);
      formik.setFieldValue('patientName', selectedPatient.name);
    }
  };

  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;
    const selectedDoctor = doctors.find(d => d.id === doctorId);
    if (selectedDoctor) {
      formik.setFieldValue('doctorId', doctorId);
      formik.setFieldValue('doctorName', selectedDoctor.name);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        {mode === 'add' ? 'Create New Lab Report' : 'Edit Lab Report'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.patientId && Boolean(formik.errors.patientId)}>
            <InputLabel id="patient-label">Patient</InputLabel>
            <Select
              labelId="patient-label"
              id="patientId"
              name="patientId"
              value={formik.values.patientId}
              onChange={handlePatientChange}
              label="Patient"
              disabled={loading}
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.patientId && formik.errors.patientId && (
              <FormHelperText>{formik.errors.patientId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}>
            <InputLabel id="doctor-label">Doctor</InputLabel>
            <Select
              labelId="doctor-label"
              id="doctorId"
              name="doctorId"
              value={formik.values.doctorId}
              onChange={handleDoctorChange}
              label="Doctor"
              disabled={loading}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.doctorId && formik.errors.doctorId && (
              <FormHelperText>{formik.errors.doctorId}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.testType && Boolean(formik.errors.testType)}>
            <InputLabel id="test-type-label">Test Type</InputLabel>
            <Select
              labelId="test-type-label"
              id="testType"
              name="testType"
              value={formik.values.testType}
              onChange={formik.handleChange}
              label="Test Type"
              disabled={loading}
            >
              {LAB_TEST_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.testType && formik.errors.testType && (
              <FormHelperText>{formik.errors.testType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Test Date"
              value={formik.values.testDate}
              onChange={(newValue) => {
                formik.setFieldValue('testDate', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  id="testDate"
                  name="testDate"
                  error={formik.touched.testDate && Boolean(formik.errors.testDate)}
                  helperText={formik.touched.testDate && formik.errors.testDate}
                  disabled={loading}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              label="Status"
              disabled={loading}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
            {formik.touched.status && formik.errors.status && (
              <FormHelperText>{formik.errors.status}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Report Date"
              value={formik.values.reportDate}
              onChange={(newValue) => {
                formik.setFieldValue('reportDate', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  id="reportDate"
                  name="reportDate"
                  error={formik.touched.reportDate && Boolean(formik.errors.reportDate)}
                  helperText={formik.touched.reportDate && formik.errors.reportDate}
                  disabled={loading}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="results"
            name="results"
            label="Test Results"
            multiline
            rows={4}
            value={formik.values.results}
            onChange={formik.handleChange}
            error={formik.touched.results && Boolean(formik.errors.results)}
            helperText={formik.touched.results && formik.errors.results}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="normalRanges"
            name="normalRanges"
            label="Normal Ranges"
            multiline
            rows={2}
            value={formik.values.normalRanges}
            onChange={formik.handleChange}
            error={formik.touched.normalRanges && Boolean(formik.errors.normalRanges)}
            helperText={formik.touched.normalRanges && formik.errors.normalRanges}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="observations"
            name="observations"
            label="Observations"
            multiline
            rows={3}
            value={formik.values.observations}
            onChange={formik.handleChange}
            error={formik.touched.observations && Boolean(formik.errors.observations)}
            helperText={formik.touched.observations && formik.errors.observations}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="conclusion"
            name="conclusion"
            label="Conclusion"
            multiline
            rows={2}
            value={formik.values.conclusion}
            onChange={formik.handleChange}
            error={formik.touched.conclusion && Boolean(formik.errors.conclusion)}
            helperText={formik.touched.conclusion && formik.errors.conclusion}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="attachmentUrl"
            name="attachmentUrl"
            label="Attachment URL"
            value={formik.values.attachmentUrl}
            onChange={formik.handleChange}
            error={formik.touched.attachmentUrl && Boolean(formik.errors.attachmentUrl)}
            helperText={formik.touched.attachmentUrl && formik.errors.attachmentUrl}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {mode === 'add' ? 'Create Report' : 'Update Report'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

LabReportForm.propTypes = {
  labReport: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit']),
};

export default LabReportForm; 
 