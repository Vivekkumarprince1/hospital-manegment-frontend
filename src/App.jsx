import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import * as authService from './services/authService';
import { AUTH_TOKEN_KEY } from './config/constants';

// Layout
import Layout from './components/layout/Layout';

// Auth components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorsList from './pages/DoctorsList';
import DoctorDetails from './pages/DoctorDetails';
import PatientsList from './pages/PatientsList';
import PatientDetails from './pages/PatientDetails';
import PatientDashboard from './pages/PatientDashboard';
import AppointmentsList from './pages/AppointmentsList';
import AppointmentDetails from './pages/AppointmentDetails';
import AdmissionsList from './pages/AdmissionsList';
import AdmissionDetails from './pages/AdmissionDetails';
import StaffDashboard from './pages/StaffDashboard';
import FinancialDashboard from './pages/FinancialDashboard';
import TransactionsPage from './pages/financial/TransactionsPage';
import NotFound from './pages/NotFound';

import AddDoctor from './pages/doctors/AddDoctorPage';
import EditDoctor from './pages/doctors/EditDoctorPage';
import AddPatient from './pages/patients/AddPatientPage';
import EditPatient from './pages/patients/EditPatientPage';
import AddAppointment from './pages/appointments/AddAppointmentPage';
import EditAppointment from './pages/appointments/EditAppointmentPage';


// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);
        
        // Set auth token if available
        if (isAuth) {
          const token = localStorage.getItem(AUTH_TOKEN_KEY);
          authService.setAuthToken(token);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = (loginData) => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login setIsAuthenticated={handleLogin} />} />
        <Route path="/register" element={<Register setIsAuthenticated={handleLogin} />} />

        {/* Protected routes with role-based access */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/patients/:id/dashboard" element={<PatientDashboard />} />
            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/appointments/:id" element={<AppointmentDetails />} />
            <Route path="/admissions" element={<AdmissionsList />} />
            <Route path="/admissions/:id" element={<AdmissionDetails />} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/financial/dashboard" element={<FinancialDashboard />} />
            <Route path="/financial/transactions" element={<TransactionsPage />} />
            <Route path="/doctors/new" element={<AddDoctor />} />
            <Route path="/doctors/:id/edit" element={<EditDoctor />} />
            <Route path="/patients/new" element={<AddPatient />} />
            <Route path="/patients/:id/edit" element={<EditPatient />} />
            <Route path="/appointments/new" element={<AddAppointment />} />
            <Route path="/appointments/:id/edit" element={<EditAppointment />} />
          </Route>
        </Route>

        {/* Home route (redirects to dashboard or login) */}
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} isLoading={isLoading} />} />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
