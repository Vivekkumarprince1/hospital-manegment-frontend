import axios from 'axios';
import { mockLabReports } from '../mockBackend';
import { API_BASE_URL } from '../config/constants';

const isDevelopment = true; // For development mode fallback to mock data

// Get all lab reports with optional filtering
export const getAllLabReports = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.testType) queryParams.append('testType', params.testType);
    
    const response = await axios.get(`${API_BASE_URL}/lab-reports?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lab reports:', error);
    throw error;
  }
};

// Get a single lab report by ID
export const getLabReportById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lab-reports/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lab report with ID ${id}:`, error);
    throw error;
  }
};

// Create a new lab report
export const createLabReport = async (labReportData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/lab-reports`, labReportData);
    return response.data;
  } catch (error) {
    console.error('Error creating lab report:', error);
    throw error;
  }
};

// Update an existing lab report
export const updateLabReport = async (id, labReportData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/lab-reports/${id}`, labReportData);
    return response.data;
  } catch (error) {
    console.error(`Error updating lab report with ID ${id}:`, error);
    throw error;
  }
};

// Delete a lab report
export const deleteLabReport = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/lab-reports/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting lab report with ID ${id}:`, error);
    throw error;
  }
};

// Get lab reports for a specific patient
export const getPatientLabReports = async (patientId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.testType) queryParams.append('testType', params.testType);
    
    const response = await axios.get(`${API_BASE_URL}/patients/${patientId}/lab-reports?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lab reports for patient ${patientId}:`, error);
    throw error;
  }
};

// Get lab reports ordered by a specific doctor
export const getDoctorLabReports = async (doctorId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.testType) queryParams.append('testType', params.testType);
    
    const response = await axios.get(`${API_BASE_URL}/doctors/${doctorId}/lab-reports?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lab reports for doctor ${doctorId}:`, error);
    throw error;
  }
};

// Update the status of a lab report
export const updateLabReportStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/lab-reports/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for lab report ${id}:`, error);
    throw error;
  }
};

// Upload attachment for a lab report
export const uploadLabReportAttachment = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('attachment', file);
    
    const response = await axios.post(`${API_BASE_URL}/lab-reports/${id}/attachment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error uploading attachment for lab report ${id}:`, error);
    throw error;
  }
};

// Get report statistics
export const getLabReportStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lab-reports/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lab report statistics:', error);
    throw error;
  }
};

// Get lab reports by patient
export const getLabReportsByPatient = async (patientId, page = 1, limit = 10) => {
  try {
    // Try to fetch from the real API
    const response = await axios.get(`${API_BASE_URL}/patients/${patientId}/lab-reports`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for patient lab reports:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const patientReports = mockLabReports.filter(
        report => report.patientId.toString() === patientId.toString()
      ).sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        reports: patientReports.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(patientReports.length / limit),
        totalReports: patientReports.length
      };
    }
    
    throw error;
  }
};

// Get lab reports by doctor
export const getLabReportsByDoctor = async (doctorId, page = 1, limit = 10) => {
  try {
    // Try to fetch from the real API
    const response = await axios.get(`${API_BASE_URL}/doctors/${doctorId}/lab-reports`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for doctor lab reports:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      const doctorReports = mockLabReports.filter(
        report => report.doctorId.toString() === doctorId.toString()
      ).sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        reports: doctorReports.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(doctorReports.length / limit),
        totalReports: doctorReports.length
      };
    }
    
    throw error;
  }
};

// Get recent lab reports
export const getRecentLabReports = async (limit = 5) => {
  try {
    // Try to fetch from the real API
    const response = await axios.get(`${API_BASE_URL}/lab-reports/recent`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for recent lab reports:', error);
    
    // Fallback to mock data
    if (isDevelopment) {
      // Sort by reportDate in descending order
      const sortedReports = [...mockLabReports].sort(
        (a, b) => new Date(b.reportDate) - new Date(a.reportDate)
      );
      
      return { reports: sortedReports.slice(0, limit) };
    }
    
    throw error;
  }
}; 