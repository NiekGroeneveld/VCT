import axios from 'axios';

/**
 * Setup axios interceptors for authentication
 * - Adds token to all requests
 * - Redirects to login on 401 Unauthorized
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor to add token to headers
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedCompany');
        localStorage.removeItem('selectedConfiguration');
        
        // Redirect to login
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
