import axios from 'axios';
import * as authService from './authService';
import { mockDoctors } from '../mockBackend';

const API_URL = 'http://localhost:5001/api/doctors';
const isDevelopment = true; // For development mode fallback to mock data

// Set auth token before each request
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    authService.setAuthToken(token);
  }
};

// Get all doctors with pagination
export const getAllDoctors = async (page = 1, limit = 10, filter = {}) => {
  try {
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(API_URL, {
      params: { page, limit, ...filter }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for doctors:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      // Filter doctors if needed
      let filteredDoctors = [...mockDoctors];
      if (filter.specialization) {
        filteredDoctors = filteredDoctors.filter(
          doctor => doctor.specialization === filter.specialization
        );
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredDoctors = filteredDoctors.filter(
          doctor => 
            doctor.name.toLowerCase().includes(searchLower) ||
            doctor.specialization.toLowerCase().includes(searchLower)
        );
      }
      
      return {
        doctors: filteredDoctors.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(filteredDoctors.length / limit),
        totalDoctors: filteredDoctors.length
      };
    }
    
    throw error;
  }
};

// Get doctor by ID
export const getDoctorById = async (id) => {
  try {
    if (!id) {
      throw new Error('Invalid doctor ID: ID is undefined or null');
    }
    
    const doctorId = id.toString();
    console.log(`Fetching doctor with ID: ${doctorId}`);
    
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(`${API_URL}/${doctorId}`);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for doctor details:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const doctorId = id.toString();
      
      const doctor = mockDoctors.find(d => 
        d.id?.toString() === doctorId || 
        d._id?.toString() === doctorId
      );
      
      if (!doctor) {
        throw new Error(`Doctor not found with ID: ${doctorId}`);
      }
      
      return { doctor };
    }
    
    throw error;
  }
};

// Create new doctor
export const createDoctor = async (doctorData) => {
  try {
    // Try to send to the real API
    setAuthHeader();
    const response = await axios.post(API_URL, doctorData);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for creating doctor:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const newDoctor = {
        id: Date.now().toString(),
        ...doctorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to mock doctors
      mockDoctors.unshift(newDoctor);
      
      return { doctor: newDoctor, message: 'Doctor created successfully' };
    }
    
    throw error;
  }
};

// Update doctor
export const updateDoctor = async (id, doctorData) => {
  try {
    if (!id) {
      throw new Error('Invalid doctor ID: ID is undefined or null');
    }
    
    const doctorId = id.toString();
    
    // Try to update on the real API
    setAuthHeader();
    console.log(`Updating doctor ${doctorId} with data:`, doctorData);
    const response = await axios.put(`${API_URL}/${doctorId}`, doctorData);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for updating doctor:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const doctorId = id.toString();
      
      const index = mockDoctors.findIndex(d => 
        d.id?.toString() === doctorId || 
        d._id?.toString() === doctorId
      );
      
      if (index === -1) {
        throw new Error(`Doctor not found with ID: ${doctorId}`);
      }
      
      // Update the doctor
      mockDoctors[index] = {
        ...mockDoctors[index],
        ...doctorData,
        updatedAt: new Date().toISOString()
      };
      
      return { 
        doctor: mockDoctors[index],
        message: 'Doctor updated successfully'
      };
    }
    
    throw error;
  }
};

// Delete a doctor
export const deleteDoctor = async (id) => {
  try {
    // Ensure user is authenticated
    setAuthHeader();
    
    console.log(`Deleting doctor with ID: ${id}`);
    
    // Try to delete on the real API
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    console.warn('Using mock data for deleting doctor');
    
    // Fallback to mock data
    if (isDevelopment) {
      // Convert string ID to match the format in the mock data
      const doctorId = id.toString();
      
      const index = mockDoctors.findIndex(d => 
        d.id?.toString() === doctorId || 
        d._id?.toString() === doctorId
      );
      
      if (index === -1) {
        throw new Error(`Doctor not found with ID: ${doctorId}`);
      }
      
      // Remove the doctor
      const deletedDoctor = mockDoctors[index];
      mockDoctors.splice(index, 1);
      
      return { 
        message: 'Doctor deleted successfully',
        deletedDoctor
      };
    }
    
    throw error;
  }
};

// Get doctors by specialization
export const getDoctorsBySpecialization = async (specialization, page = 1, limit = 10) => {
  try {
    // Try to fetch from the real API
    const response = await axios.get(`${API_URL}/specialization/${specialization}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for doctors by specialization:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const specializationDoctors = mockDoctors.filter(
        doctor => doctor.specialization === specialization
      );
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        doctors: specializationDoctors.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(specializationDoctors.length / limit),
        totalDoctors: specializationDoctors.length
      };
    }
    
    throw error;
  }
}; 
 