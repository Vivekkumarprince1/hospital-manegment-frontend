export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY || 'hms_auth_token',
  AUTH_USER_KEY: import.meta.env.VITE_AUTH_USER_KEY || 'hms_user_data',
  ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Hospital Management System',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
