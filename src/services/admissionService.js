import axios from 'axios';
import * as authService from './authService';

const API_URL = 'http://localhost:5001/api/admissions';
const isDevelopment = true; // For development mode fallback to mock data

// Mock admission data for development
export const mockAdmissions = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '1',
    doctorName: 'Dr. Jane Wilson',
    roomNumber: '101',
    wardType: 'General',
    admissionDate: '2023-04-01',
    dischargeDate: null,
    reasonForAdmission: 'Acute appendicitis',
    diagnosis: 'Inflamed appendix requiring surgery',
    treatmentPlan: 'Appendectomy followed by 3 days of observation',
    status: 'Active',
    notes: 'Patient reports abdominal pain for 24 hours',
    createdAt: '2023-04-01T10:30:00.000Z',
    updatedAt: '2023-04-01T14:45:00.000Z'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Emily Johnson',
    doctorId: '2',
    doctorName: 'Dr. Robert Brown',
    roomNumber: '205',
    wardType: 'Private',
    admissionDate: '2023-03-28',
    dischargeDate: '2023-04-02',
    reasonForAdmission: 'Pneumonia',
    diagnosis: 'Bacterial pneumonia in right lung',
    treatmentPlan: 'IV antibiotics and respiratory therapy',
    status: 'Discharged',
    notes: 'Patient improving with treatment',
    dischargeNotes: 'Patient to continue oral antibiotics at home',
    dischargeSummary: 'Discharged in stable condition with follow-up in 1 week',
    createdAt: '2023-03-28T08:15:00.000Z',
    updatedAt: '2023-04-02T11:20:00.000Z'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Michael Davis',
    doctorId: '3',
    doctorName: 'Dr. Sarah Miller',
    roomNumber: '302',
    wardType: 'ICU',
    admissionDate: '2023-04-03',
    dischargeDate: null,
    reasonForAdmission: 'Myocardial infarction',
    diagnosis: 'Acute STEMI',
    treatmentPlan: 'Emergency catheterization, ICU monitoring',
    status: 'Active',
    notes: 'Patient stabilized after procedure',
    createdAt: '2023-04-03T02:45:00.000Z',
    updatedAt: '2023-04-03T16:30:00.000Z'
  }
];

// Set auth token before each request
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    authService.setAuthToken(token);
  }
};

// Get all admissions with pagination
export const getAllAdmissions = async (page = 1, limit = 10, filter = {}) => {
  try {
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(API_URL, {
      params: { page, limit, ...filter }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for admissions:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      // Filter admissions if needed
      let filteredAdmissions = [...mockAdmissions];
      if (filter.status) {
        filteredAdmissions = filteredAdmissions.filter(
          admission => admission.status === filter.status
        );
      }
      if (filter.patientId) {
        filteredAdmissions = filteredAdmissions.filter(
          admission => admission.patientId.toString() === filter.patientId.toString()
        );
      }
      if (filter.doctorId) {
        filteredAdmissions = filteredAdmissions.filter(
          admission => admission.doctorId.toString() === filter.doctorId.toString()
        );
      }
      
      return {
        admissions: filteredAdmissions.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(filteredAdmissions.length / limit),
        totalAdmissions: filteredAdmissions.length
      };
    }
    
    throw error;
  }
};

// Get admission by ID
export const getAdmissionById = async (id) => {
  try {
    if (!id) {
      throw new Error('Invalid admission ID: ID is undefined or null');
    }
    
    const admissionId = id.toString();
    console.log(`Fetching admission with ID: ${admissionId}`);
    
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(`${API_URL}/${admissionId}`);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for admission details:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const admissionId = id.toString();
      
      const admission = mockAdmissions.find(a => 
        a.id?.toString() === admissionId || 
        a._id?.toString() === admissionId
      );
      
      if (!admission) {
        throw new Error(`Admission not found with ID: ${admissionId}`);
      }
      
      return { admission };
    }
    
    throw error;
  }
};

// Get patient admissions
export const getPatientAdmissions = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('Invalid patient ID: ID is undefined or null');
    }
    
    const id = patientId.toString();
    console.log(`Fetching admissions for patient with ID: ${id}`);
    
    // Try to fetch from the real API
    setAuthHeader();
    const response = await axios.get(`${API_URL}/patient/${id}`);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for patient admissions:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const id = patientId.toString();
      
      const patientAdmissions = mockAdmissions.filter(a => 
        a.patientId?.toString() === id
      );
      
      return { 
        admissions: patientAdmissions,
        count: patientAdmissions.length
      };
    }
    
    throw error;
  }
};

// Create new admission
export const createAdmission = async (admissionData) => {
  try {
    // Ensure user is authenticated
    setAuthHeader();
    
    // Log the data being sent
    console.log('Creating admission with data:', admissionData);
    
    // Try to send to the real API
    const response = await axios.post(API_URL, admissionData);
    return response.data;
  } catch (error) {
    console.error('Error creating admission:', error);
    console.warn('Using mock data for creating admission:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const newAdmission = {
        id: Date.now().toString(),
        ...admissionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: admissionData.status || 'Active',
        dischargeDate: null
      };
      
      // Add to mock admissions
      mockAdmissions.unshift(newAdmission);
      
      return { admission: newAdmission, message: 'Admission created successfully' };
    }
    
    throw error;
  }
};

// Update admission
export const updateAdmission = async (id, admissionData) => {
  try {
    if (!id) {
      throw new Error('Invalid admission ID: ID is undefined or null');
    }
    
    const admissionId = id.toString();
    
    // Ensure user is authenticated
    setAuthHeader();
    
    // Log the data being sent
    console.log(`Updating admission ${admissionId} with data:`, admissionData);
    
    // Try to update on the real API
    const response = await axios.put(`${API_URL}/${admissionId}`, admissionData);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for updating admission:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const admissionId = id.toString();
      
      const index = mockAdmissions.findIndex(a => 
        a.id?.toString() === admissionId || 
        a._id?.toString() === admissionId
      );
      
      if (index === -1) {
        throw new Error(`Admission not found with ID: ${admissionId}`);
      }
      
      // Update the admission
      mockAdmissions[index] = {
        ...mockAdmissions[index],
        ...admissionData,
        updatedAt: new Date().toISOString()
      };
      
      return { 
        admission: mockAdmissions[index],
        message: 'Admission updated successfully'
      };
    }
    
    throw error;
  }
};

// Discharge patient
export const dischargePatient = async (id, dischargeData) => {
  try {
    if (!id) {
      throw new Error('Invalid admission ID: ID is undefined or null');
    }
    
    const admissionId = id.toString();
    
    // Ensure user is authenticated
    setAuthHeader();
    
    // Log the data being sent
    console.log(`Discharging patient from admission ${admissionId} with data:`, dischargeData);
    
    // Try to send to the real API
    const response = await axios.put(`${API_URL}/${admissionId}/discharge`, dischargeData);
    return response.data;
  } catch (error) {
    console.warn('Using mock data for discharging patient:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const admissionId = id.toString();
      
      const index = mockAdmissions.findIndex(a => 
        a.id?.toString() === admissionId || 
        a._id?.toString() === admissionId
      );
      
      if (index === -1) {
        throw new Error(`Admission not found with ID: ${admissionId}`);
      }
      
      // Update the admission
      mockAdmissions[index] = {
        ...mockAdmissions[index],
        status: 'Discharged',
        dischargeDate: dischargeData.dischargeDate || new Date().toISOString().split('T')[0],
        dischargeNotes: dischargeData.dischargeNotes || '',
        dischargeSummary: dischargeData.dischargeSummary || '',
        updatedAt: new Date().toISOString()
      };
      
      return { 
        admission: mockAdmissions[index],
        message: 'Patient discharged successfully'
      };
    }
    
    throw error;
  }
};

// Delete admission
export const deleteAdmission = async (id) => {
  try {
    // Ensure user is authenticated
    setAuthHeader();
    
    console.log(`Deleting admission with ID: ${id}`);
    
    // Try to delete on the real API
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admission:', error);
    console.warn('Using mock data for deleting admission');
    
    // Fallback to mock data
    if (isDevelopment) {
      // Convert string ID to match the format in the mock data
      const admissionId = id.toString();
      
      const index = mockAdmissions.findIndex(a => 
        a.id?.toString() === admissionId || 
        a._id?.toString() === admissionId
      );
      
      if (index === -1) {
        throw new Error(`Admission not found with ID: ${admissionId}`);
      }
      
      // Remove the admission
      const deletedAdmission = mockAdmissions[index];
      mockAdmissions.splice(index, 1);
      
      return { 
        message: 'Admission deleted successfully',
        deletedAdmission
      };
    }
    
    throw error;
  }
}; 