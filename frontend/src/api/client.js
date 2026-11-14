import axios from 'axios';

// Base API URL: uses Vite proxy '/api' or environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('leetcode_daily_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    // Backend standard ApiResponse returns { success: true, message: "...", data: {...} }
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        localStorage.removeItem('leetcode_daily_token');
        localStorage.removeItem('leetcode_daily_user');
        // Only redirect if not already on login/register page
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
      const message = error.response.data?.message || error.response.data?.error || 'A server error occurred.';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('Unable to connect to the LeetCode Daily server. Please ensure backend is running.'));
    } else {
      return Promise.reject(error);
    }
  }
);

export default apiClient;

