import axios from 'axios';
import { mockLogin, mockRegister } from '../mockBackend';
import { API_BASE_URL, IS_DEVELOPMENT, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../config/constants';

const API_URL = `${API_BASE_URL}/auth`;

// Set auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Login user
export const login = async (credentials) => {
  if (IS_DEVELOPMENT) {
    try {
      // First try the real backend
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      if (response.data.token) {
        // Store user in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.user));
        
        // Set auth token for future requests
        setAuthToken(response.data.token);
        return response.data;
      }
    } catch (error) {
      // If backend fails, fall back to mock
      console.warn('Failed to connect to real backend, using mock data');
      try {
        const userData = mockLogin(credentials);
        
        // Store in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, userData.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify({
          id: userData.user.id,
          name: userData.user.name,
          email: userData.user.email,
          role: userData.user.role
        }));
        
        setAuthToken(userData.token);
        return userData;
      } catch (mockError) {
        throw { response: { data: { message: mockError.message } } };
      }
    }
  } else {
    // Use real API in production
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    if (response.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.user));
      
      setAuthToken(response.data.token);
    }
    
    return response.data;
  }
};

// Register user
export const register = async (userData) => {
  if (IS_DEVELOPMENT) {
    try {
      // First try the real backend
      const response = await axios.post(`${API_URL}/register`, userData);
      
      if (response.data.token) {
        // Store user in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.user));
        
        // Set auth token for future requests
        setAuthToken(response.data.token);
        return response.data;
      }
    } catch (error) {
      // If backend fails, fall back to mock
      console.warn('Failed to connect to real backend, using mock data');
      try {
        const newUser = mockRegister(userData);
        
        // Store in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, newUser.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify({
          id: newUser.user.id,
          name: newUser.user.name,
          email: newUser.user.email,
          role: newUser.user.role
        }));
        
        setAuthToken(newUser.token);
        return newUser;
      } catch (mockError) {
        throw { response: { data: { message: mockError.message } } };
      }
    }
  } else {
    // Use real API in production
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (response.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.user));
      
      setAuthToken(response.data.token);
    }
    
    return response.data;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  setAuthToken(null);
};

// Get current user profile
export const getCurrentUser = async () => {
  if (IS_DEVELOPMENT) {
    try {
      // Try to call the real API first
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        setAuthToken(token);
        const response = await axios.get(`${API_URL}/profile`);
        return response.data;
      }
    } catch (error) {
      // Fall back to stored user
      console.warn('Failed to connect to real backend, using stored user data');
      const user = getUser();
      return user;
    }
  } else {
    // In production, call the API
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      setAuthToken(token);
      const response = await axios.get(`${API_URL}/profile`);
      return response.data;
    }
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
};

// Get user from local storage
export const getUser = () => {
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};
