import axios from 'axios';
import { toast } from '../utils/toastEmitter';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      toast.error('Session expired. Please login again.');
      window.location.href = '/';
    } else if (error.response?.status === 403 && message.toLowerCase().includes('suspended')) {
      localStorage.removeItem('token');
      toast.error(message);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else if (error.response?.status === 503) {
      // Redirection should only happen for non-admin requests if needed, 
      // but here the middleware handles it on the backend.
      if (window.location.pathname !== '/maintenance') {
        window.location.href = '/maintenance';
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
