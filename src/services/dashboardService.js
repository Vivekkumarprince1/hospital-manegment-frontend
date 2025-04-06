import axios from 'axios';
import * as authService from './authService';
import { mockDashboardStats } from '../mockBackend';

const API_URL = 'http://localhost:5001/api/dashboard';
const isDevelopment = true; // Set to true during development

// Set auth token before each request
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    authService.setAuthToken(token);
  }
};

// Get dashboard statistics
export const getStatistics = async () => {
  try {
    // First try the real backend
    setAuthHeader();
    const response = await axios.get(`${API_URL}/statistics`);
    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.warn('Failed to connect to real backend, using mock data');
      // Mock data for development
      return mockDashboardStats;
    }
    throw error;
  }
};

// Get recent appointments
export const getRecentAppointments = async (limit = 5) => {
  try {
    // First try the real backend
    setAuthHeader();
    const response = await axios.get(`${API_URL}/recent-appointments?limit=${limit}`);
    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.warn('Failed to connect to real backend, using mock data');
      // Mock data for development
      return [
        {
          id: 1,
          patientName: 'John Doe',
          doctorName: 'Dr. Sarah Johnson',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          status: 'scheduled',
          type: 'Follow-up'
        },
        {
          id: 2,
          patientName: 'Emma Wilson',
          doctorName: 'Dr. Michael Chen',
          date: new Date().toISOString().split('T')[0],
          time: '14:30',
          status: 'completed',
          type: 'Consultation'
        }
      ];
    }
    throw error;
  }
};

// Get today's appointments
export const getTodayAppointments = async () => {
  try {
    // First try the real backend
    setAuthHeader();
    const response = await axios.get(`${API_URL}/today-appointments`);
    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.warn('Failed to connect to real backend, using mock data');
      // Mock data for development
      return [
        {
          id: 1,
          patientName: 'John Doe',
          doctorName: 'Dr. Sarah Johnson',
          time: '10:00',
          type: 'Follow-up',
          status: 'scheduled'
        },
        {
          id: 2,
          patientName: 'Emma Wilson',
          doctorName: 'Dr. Michael Chen',
          time: '14:30',
          type: 'Consultation',
          status: 'scheduled'
        },
        {
          id: 3,
          patientName: 'Robert Smith',
          doctorName: 'Dr. Emily Davis',
          time: '16:00',
          type: 'Lab Test',
          status: 'scheduled'
        }
      ];
    }
    throw error;
  }
};

// Get revenue statistics for admin
export const getRevenueStatistics = async () => {
  try {
    // First try the real backend
    setAuthHeader();
    const response = await axios.get(`${API_URL}/revenue`);
    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.warn('Failed to connect to real backend, using mock data');
      // Mock data for development
      const currentYear = new Date().getFullYear();
      return {
        monthlyRevenue: [
          { month: 'January', revenue: 45000 },
          { month: 'February', revenue: 52000 },
          { month: 'March', revenue: 48000 },
          { month: 'April', revenue: 61000 },
          { month: 'May', revenue: 55000 },
          { month: 'June', revenue: 67000 }
        ],
        totalRevenue: 328000,
        year: currentYear
      };
    }
    throw error;
  }
}; 
 