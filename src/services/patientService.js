import axios from 'axios';
import * as authService from './authService';
import { mockPatients } from '../mockBackend';

const API_URL = 'http://localhost:5001/api/patients';
const isDevelopment = true; // For development mode fallback to mock data

// Set auth token before each request
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    authService.setAuthToken(token);
  }
};

// Get all patients with pagination
export const getAllPatients = async (page = 1, limit = 10, filter = {}) => {
  try {
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(API_URL, {
      params: { page, limit, ...filter }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for patients:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      // Filter patients if needed
      let filteredPatients = [...mockPatients];
      if (filter.gender) {
        filteredPatients = filteredPatients.filter(
          patient => patient.gender === filter.gender
        );
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredPatients = filteredPatients.filter(
          patient => 
            patient.name.toLowerCase().includes(searchLower) ||
            patient.email.toLowerCase().includes(searchLower) ||
            patient.phone.toLowerCase().includes(searchLower)
        );
      }
      
      return {
        patients: filteredPatients.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(filteredPatients.length / limit),
        totalPatients: filteredPatients.length
      };
    }
    
    throw error;
  }
};

// Get patient by ID
export const getPatientById = async (id) => {
  try {
    if (!id) {
      throw new Error('Invalid patient ID: ID is undefined or null');
    }
    
    const patientId = id.toString();
    console.log(`Fetching patient with ID: ${patientId}`);
    
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(`${API_URL}/${patientId}`);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for patient details:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const patientId = id.toString();
      
      const patient = mockPatients.find(p => 
        p.id?.toString() === patientId || 
        p._id?.toString() === patientId
      );
      
      if (!patient) {
        throw new Error(`Patient not found with ID: ${patientId}`);
      }
      
      return { patient };
    }
    
    throw error;
  }
};

// Create new patient
export const createPatient = async (patientData) => {
  try {
    // Ensure user is authenticated
    setAuthHeader();
    
    // Log the data being sent
    console.log('Creating patient with data:', patientData);
    
    // Ensure the data has all required fields
    const formattedData = {
      ...patientData,
      // Convert dateOfBirth to string if it's a Date object
      dateOfBirth: patientData.dateOfBirth instanceof Date 
        ? patientData.dateOfBirth.toISOString().split('T')[0] 
        : patientData.dateOfBirth,
      // Ensure age is a number
      age: Number(patientData.age),
      // Set default status if missing
      status: patientData.status || 'Active'
    };
    
    // Try to send to the real API
    const response = await axios.post(API_URL, formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    console.warn('Using mock data for creating patient:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const newPatient = {
        id: Date.now().toString(),
        ...patientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to mock patients
      mockPatients.unshift(newPatient);
      
      return { patient: newPatient, message: 'Patient created successfully' };
    }
    
    throw error;
  }
};

// Update patient
export const updatePatient = async (id, patientData) => {
  try {
    if (!id) {
      throw new Error('Invalid patient ID: ID is undefined or null');
    }
    
    const patientId = id.toString();
    
    // Ensure user is authenticated
    setAuthHeader();
    
    // Log the data being sent
    console.log(`Updating patient ${patientId} with data:`, patientData);
    
    // Ensure the data has all required fields
    const formattedData = {
      ...patientData,
      // Convert dateOfBirth to string if it's a Date object
      dateOfBirth: patientData.dateOfBirth instanceof Date 
        ? patientData.dateOfBirth.toISOString().split('T')[0] 
        : patientData.dateOfBirth,
      // Ensure age is a number
      age: Number(patientData.age)
    };
    
    // Try to update on the real API
    const response = await axios.put(`${API_URL}/${patientId}`, formattedData);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for updating patient:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const patientId = id.toString();
      
      const index = mockPatients.findIndex(p => 
        p.id?.toString() === patientId || 
        p._id?.toString() === patientId
      );
      
      if (index === -1) {
        throw new Error(`Patient not found with ID: ${patientId}`);
      }
      
      // Update the patient
      mockPatients[index] = {
        ...mockPatients[index],
        ...patientData,
        updatedAt: new Date().toISOString()
      };
      
      return { 
        patient: mockPatients[index],
        message: 'Patient updated successfully'
      };
    }
    
    throw error;
  }
};

// Delete a patient
export const deletePatient = async (id) => {
  try {
    // Ensure user is authenticated
    setAuthHeader();
    
    console.log(`Deleting patient with ID: ${id}`);
    
    // Try to delete on the real API
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting patient:', error);
    console.warn('Using mock data for deleting patient');
    
    // Fallback to mock data
    if (isDevelopment) {
      // Convert string ID to match the format in the mock data
      const patientId = id.toString();
      
      const index = mockPatients.findIndex(p => 
        p.id?.toString() === patientId || 
        p._id?.toString() === patientId
      );
      
      if (index === -1) {
        throw new Error(`Patient not found with ID: ${patientId}`);
      }
      
      // Remove the patient
      const deletedPatient = mockPatients[index];
      mockPatients.splice(index, 1);
      
      return { 
        message: 'Patient deleted successfully',
        deletedPatient
      };
    }
    
    throw error;
  }
}; 
 