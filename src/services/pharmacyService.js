import axios from 'axios';
import { mockMedicines } from '../mockBackend';
import { API_BASE_URL, IS_DEVELOPMENT } from '../config/constants';

const API_URL = `${API_BASE_URL}/pharmacy`;

// Get all medicines with optional filtering
export const getAllMedicines = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.requiresPrescription !== undefined) queryParams.append('requiresPrescription', params.requiresPrescription);
    
    const response = await axios.get(`${API_BASE_URL}/medicines?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
};

// Get a single medicine by ID
export const getMedicineById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicines/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching medicine with ID ${id}:`, error);
    throw error;
  }
};

// Create a new medicine
export const createMedicine = async (medicineData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/medicines`, medicineData);
    return response.data;
  } catch (error) {
    console.error('Error creating medicine:', error);
    throw error;
  }
};

// Update an existing medicine
export const updateMedicine = async (id, medicineData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/medicines/${id}`, medicineData);
    return response.data;
  } catch (error) {
    console.error(`Error updating medicine with ID ${id}:`, error);
    throw error;
  }
};

// Delete a medicine
export const deleteMedicine = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/medicines/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting medicine with ID ${id}:`, error);
    throw error;
  }
};

// Update medicine stock
export const updateMedicineStock = async (id, stockDelta) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/medicines/${id}/stock`, { stockDelta });
    return response.data;
  } catch (error) {
    console.error(`Error updating stock for medicine ${id}:`, error);
    throw error;
  }
};

// Get low stock medicines
export const getLowStockMedicines = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicines/low-stock?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock medicines:', error);
    throw error;
  }
};

// Get expiring medicines
export const getExpiringMedicines = async (days = 30, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicines/expiring?days=${days}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching expiring medicines:', error);
    throw error;
  }
};

// Get pharmacy statistics
export const getPharmacyStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicines/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pharmacy statistics:', error);
    throw error;
  }
};

// Get medicines by category
export const getMedicinesByCategory = async (category, page = 1, limit = 10) => {
  try {
    // Try to fetch from the real API
    const response = await axios.get(`${API_URL}/medicines/category/${category}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock data for medicines by category:', error);
    
    // Fallback to mock data
    if (IS_DEVELOPMENT) {
      const categoryMedicines = mockMedicines.filter(
        medicine => medicine.category === category
      );
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        medicines: categoryMedicines.slice(startIndex, endIndex),
        page,
        limit,
        totalPages: Math.ceil(categoryMedicines.length / limit),
        totalMedicines: categoryMedicines.length
      };
    }
    
    throw error;
  }
};
