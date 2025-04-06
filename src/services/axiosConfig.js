import axios from 'axios';
import { config } from '../config/env';

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(config.AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response errors here
    if (config.ENABLE_ERROR_REPORTING) {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
