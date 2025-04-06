import axios from 'axios';
import * as authService from './authService';
import { mockAppointments } from '../mockBackend';

const API_URL = 'http://localhost:5001/api/appointments';
const isDevelopment = true; // For development mode fallback to mock data

// Set auth token before each request
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    authService.setAuthToken(token);
  }
};

// Get all appointments with pagination
export const getAllAppointments = async (page = 1, limit = 10, filter = {}) => {
  try {
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(API_URL, {
      params: { page, limit, ...filter }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for appointments:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      // Filter appointments if needed
      let filteredAppointments = [...mockAppointments];
      if (filter.status) {
        filteredAppointments = filteredAppointments.filter(
          appointment => appointment.status === filter.status
        );
      }
      if (filter.doctorId) {
        filteredAppointments = filteredAppointments.filter(
          appointment => appointment.doctorId.toString() === filter.doctorId.toString()
        );
      }
      if (filter.patientId) {
        filteredAppointments = filteredAppointments.filter(
          appointment => appointment.patientId.toString() === filter.patientId.toString()
        );
      }
      if (filter.date) {
        filteredAppointments = filteredAppointments.filter(
          appointment => appointment.date === filter.date
        );
      }
      
      return {
        appointments: filteredAppointments.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(filteredAppointments.length / limit),
        totalAppointments: filteredAppointments.length
      };
    }
    
    throw error;
  }
};

// Get appointment by ID
export const getAppointmentById = async (id) => {
  try {
    if (!id) {
      throw new Error('Invalid appointment ID: ID is undefined or null');
    }
    
    const appointmentId = id.toString();
    console.log(`Fetching appointment with ID: ${appointmentId}`);
    
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(`${API_URL}/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for appointment details:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const appointmentId = id.toString();
      
      const appointment = mockAppointments.find(a => 
        a.id?.toString() === appointmentId || 
        a._id?.toString() === appointmentId
      );
      
      if (!appointment) {
        throw new Error(`Appointment not found with ID: ${appointmentId}`);
      }
      
      return { appointment };
    }
    
    throw error;
  }
};

// Create new appointment
export const createAppointment = async (appointmentData) => {
  try {
    // Ensure user is authenticated
    setAuthHeader();
    
    // Log the data being sent
    console.log('Creating appointment with data:', appointmentData);
    
    // Format data for backend
    const formattedData = {
      ...appointmentData,
      // Ensure date is in YYYY-MM-DD format
      date: appointmentData.date instanceof Date 
        ? appointmentData.date.toISOString().split('T')[0] 
        : appointmentData.date
    };
    
    // Try to send to the real API
    const response = await axios.post(API_URL, formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    console.warn('Using mock data for creating appointment:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const newAppointment = {
        id: Date.now().toString(),
        ...appointmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: appointmentData.status || 'Scheduled'
      };
      
      // Add to mock appointments
      mockAppointments.unshift(newAppointment);
      
      return { appointment: newAppointment, message: 'Appointment created successfully' };
    }
    
    throw error;
  }
};

// Update appointment
export const updateAppointment = async (id, appointmentData) => {
  try {
    if (!id) {
      throw new Error('Invalid appointment ID: ID is undefined or null');
    }
    
    const appointmentId = id.toString();
    
    // Ensure user is authenticated
    setAuthHeader();
    
    // Log the data being sent
    console.log(`Updating appointment ${appointmentId} with data:`, appointmentData);
    
    // Format data for backend
    const formattedData = {
      ...appointmentData,
      // Ensure date is in YYYY-MM-DD format
      date: appointmentData.date instanceof Date 
        ? appointmentData.date.toISOString().split('T')[0] 
        : appointmentData.date
    };
    
    // Try to update on the real API
    const response = await axios.put(`${API_URL}/${appointmentId}`, formattedData);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for updating appointment:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const appointmentId = id.toString();
      
      const index = mockAppointments.findIndex(a => 
        a.id?.toString() === appointmentId || 
        a._id?.toString() === appointmentId
      );
      
      if (index === -1) {
        throw new Error(`Appointment not found with ID: ${appointmentId}`);
      }
      
      // Update the appointment
      mockAppointments[index] = {
        ...mockAppointments[index],
        ...appointmentData,
        updatedAt: new Date().toISOString()
      };
      
      return { 
        appointment: mockAppointments[index],
        message: 'Appointment updated successfully'
      };
    }
    
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (id, status) => {
  try {
    // Ensure user is authenticated
    setAuthHeader();
    
    // Try to update on the real API
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for updating appointment status:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const index = mockAppointments.findIndex(a => a.id.toString() === id.toString());
      
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      
      // Update appointment status
      mockAppointments[index] = {
        ...mockAppointments[index],
        status,
        updatedAt: new Date().toISOString()
      };
      
      // Add timestamps based on status
      if (status === 'Completed') {
        mockAppointments[index].completedAt = new Date().toISOString();
      } else if (status === 'Cancelled') {
        mockAppointments[index].cancelledAt = new Date().toISOString();
      }
      
      return { 
        appointment: mockAppointments[index],
        message: `Appointment status updated to ${status}`
      };
    }
    
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (id) => {
  try {
    // Ensure user is authenticated
    setAuthHeader();
    
    // Try to delete on the real API
    console.log(`Deleting appointment with ID: ${id}`);
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for deleting appointment:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      // Convert string ID to match the format in the mock data
      const appointmentId = id.toString();
      
      const index = mockAppointments.findIndex(a => 
        a.id?.toString() === appointmentId || 
        a._id?.toString() === appointmentId
      );
      
      if (index === -1) {
        throw new Error(`Appointment not found with ID: ${appointmentId}`);
      }
      
      // Remove the appointment
      const deletedAppointment = mockAppointments[index];
      mockAppointments.splice(index, 1);
      
      return { 
        message: 'Appointment deleted successfully',
        deletedAppointment
      };
    }
    
    throw error;
  }
};

// Get today's appointments
export const getTodayAppointments = async () => {
  try {
    // Ensure user is authenticated
    setAuthHeader();
    
    // Try to fetch from the real API
    const today = new Date().toISOString().split('T')[0];
    const response = await axios.get(`${API_URL}`, { 
      params: { date: today }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for today appointments:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = mockAppointments.filter(
        appointment => appointment.date === today
      ).sort((a, b) => {
        return a.time.localeCompare(b.time);
      });
      
      return { appointments: todayAppointments };
    }
    
    throw error;
  }
};

// Get recent appointments
export const getRecentAppointments = async (limit = 5) => {
  try {
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(`${API_URL}/recent`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for recent appointments:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      // Sort by createdAt in descending order
      const sortedAppointments = [...mockAppointments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      return { appointments: sortedAppointments.slice(0, limit) };
    }
    
    throw error;
  }
};

// Get appointments by patient
export const getAppointmentsByPatient = async (patientId, page = 1, limit = 10) => {
  try {
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(`${API_URL}/patient/${patientId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for patient appointments:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const patientAppointments = mockAppointments.filter(
        appointment => appointment.patientId.toString() === patientId.toString()
      ).sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        appointments: patientAppointments.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(patientAppointments.length / limit),
        totalAppointments: patientAppointments.length
      };
    }
    
    throw error;
  }
};

// Get appointments by doctor
export const getAppointmentsByDoctor = async (doctorId, page = 1, limit = 10) => {
  try {
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(`${API_URL}/doctor/${doctorId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for doctor appointments:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const doctorAppointments = mockAppointments.filter(
        appointment => appointment.doctorId.toString() === doctorId.toString()
      ).sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        appointments: doctorAppointments.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(doctorAppointments.length / limit),
        totalAppointments: doctorAppointments.length
      };
    }
    
    throw error;
  }
}; 