import React, { useState } from 'react';
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
  Stack,
  InputAdornment
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import * as pharmacyService from '../../services/pharmacyService';

const categories = [
  'Analgesics',
  'Antibiotics',
  'Antivirals',
  'Cardiovascular',
  'Dermatological',
  'Gastrointestinal',
  'Hormonal',
  'Neurological',
  'Ophthalmic',
  'Respiratory',
  'Supplements',
  'Other'
];

const validationSchema = yup.object({
  name: yup.string().required('Medicine name is required'),
  category: yup.string().required('Category is required'),
  manufacturer: yup.string().required('Manufacturer is required'),
  description: yup.string(),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  stock: yup.number().integer('Stock must be an integer').min(0, 'Stock cannot be negative').required('Stock is required'),
  expiryDate: yup.date().required('Expiry date is required'),
  dosage: yup.string(),
  strength: yup.string(),
  requiresPrescription: yup.boolean(),
  sideEffects: yup.string(),
  storageInstructions: yup.string(),
});

const MedicineForm = ({ medicine, onSuccess, mode = 'add' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    name: medicine?.name || '',
    category: medicine?.category || '',
    manufacturer: medicine?.manufacturer || '',
    description: medicine?.description || '',
    price: medicine?.price || '',
    stock: medicine?.stock || 0,
    expiryDate: medicine?.expiryDate ? new Date(medicine.expiryDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default to 1 year from now
    dosage: medicine?.dosage || '',
    strength: medicine?.strength || '',
    requiresPrescription: medicine?.requiresPrescription || false,
    sideEffects: medicine?.sideEffects || '',
    storageInstructions: medicine?.storageInstructions || '',
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
          expiryDate: values.expiryDate?.toISOString().split('T')[0],
        };

        let response;
        if (mode === 'add') {
          response = await pharmacyService.createMedicine(formattedValues);
        } else {
          response = await pharmacyService.updateMedicine(medicine._id, formattedValues);
        }

        if (response) {
          onSuccess(response);
        }
      } catch (err) {
        console.error('Error saving medicine:', err);
        setError(err.message || 'Failed to save medicine. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        {mode === 'add' ? 'Add New Medicine' : 'Edit Medicine'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Medicine Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              label="Category"
              disabled={loading}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.category && formik.errors.category && (
              <FormHelperText>{formik.errors.category}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="manufacturer"
            name="manufacturer"
            label="Manufacturer"
            value={formik.values.manufacturer}
            onChange={formik.handleChange}
            error={formik.touched.manufacturer && Boolean(formik.errors.manufacturer)}
            helperText={formik.touched.manufacturer && formik.errors.manufacturer}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="price"
            name="price"
            label="Price"
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="stock"
            name="stock"
            label="Stock Quantity"
            type="number"
            value={formik.values.stock}
            onChange={formik.handleChange}
            error={formik.touched.stock && Boolean(formik.errors.stock)}
            helperText={formik.touched.stock && formik.errors.stock}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Expiry Date"
              value={formik.values.expiryDate}
              onChange={(newValue) => {
                formik.setFieldValue('expiryDate', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  id="expiryDate"
                  name="expiryDate"
                  error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                  helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                  disabled={loading}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="dosage"
            name="dosage"
            label="Dosage Instructions"
            value={formik.values.dosage}
            onChange={formik.handleChange}
            error={formik.touched.dosage && Boolean(formik.errors.dosage)}
            helperText={formik.touched.dosage && formik.errors.dosage}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="strength"
            name="strength"
            label="Strength"
            value={formik.values.strength}
            onChange={formik.handleChange}
            error={formik.touched.strength && Boolean(formik.errors.strength)}
            helperText={formik.touched.strength && formik.errors.strength}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="prescription-label">Requires Prescription</InputLabel>
            <Select
              labelId="prescription-label"
              id="requiresPrescription"
              name="requiresPrescription"
              value={formik.values.requiresPrescription}
              onChange={formik.handleChange}
              label="Requires Prescription"
              disabled={loading}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="sideEffects"
            name="sideEffects"
            label="Side Effects"
            multiline
            rows={2}
            value={formik.values.sideEffects}
            onChange={formik.handleChange}
            error={formik.touched.sideEffects && Boolean(formik.errors.sideEffects)}
            helperText={formik.touched.sideEffects && formik.errors.sideEffects}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="storageInstructions"
            name="storageInstructions"
            label="Storage Instructions"
            value={formik.values.storageInstructions}
            onChange={formik.handleChange}
            error={formik.touched.storageInstructions && Boolean(formik.errors.storageInstructions)}
            helperText={formik.touched.storageInstructions && formik.errors.storageInstructions}
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
              {mode === 'add' ? 'Add Medicine' : 'Update Medicine'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

MedicineForm.propTypes = {
  medicine: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit']),
};

export default MedicineForm; 