import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import * as authService from '../../services/authService';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    email: '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setError(null);

      // Call login service
      const response = await authService.login({ 
        email: values.email, 
        password: values.password 
      });

      if (response && response.token) {
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Sign in to access the Hospital Management System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="email"
                      label="Email Address"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading || isSubmitting}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" variant="body2">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* Demo Credentials */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Demo Credentials:
          </Typography>
          <Typography variant="body2">
            Admin: admin@example.com / password123
          </Typography>
          <Typography variant="body2">
            Doctor: doctor@example.com / password123
          </Typography>
          <Typography variant="body2">
            Nurse: nurse@example.com / password123
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage; 