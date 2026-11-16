import axios from 'axios';

// Base API URL: normalizes environment variable or falls back to Vite proxy '/api/v1'
const getNormalizedBaseUrl = () => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (!envUrl) {
    return '/api/v1';
  }
  const cleanUrl = envUrl.replace(/\/+$/, '');
  if (cleanUrl.endsWith('/api/v1')) {
    return cleanUrl;
  }
  return `${cleanUrl}/api/v1`;
};

const API_BASE_URL = getNormalizedBaseUrl();

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
    const isPublicAuth = config.url && (
      config.url.endsWith('/auth/login') ||
      config.url.endsWith('/auth/register') ||
      config.url.includes('/auth/login?') ||
      config.url.includes('/auth/register?')
    );
    const token = localStorage.getItem('leetcode_daily_token');
    if (token && token !== 'null' && token !== 'undefined' && !isPublicAuth) {
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
        // Only redirect if on protected routes
        const path = window.location.pathname;
        if (path !== '/' && !path.includes('/login') && !path.includes('/register')) {
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
