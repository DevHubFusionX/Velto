import axios from 'axios';
import { toast } from '../utils/toastEmitter';

const rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = rawBaseURL ? (rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`) : undefined;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const isLoginRequest = config.url.includes('/auth/login') || config.url.includes('login');

    if (token && !isLoginRequest) {
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

      // Don't show toast or redirect if we're on the landing page or it's a login attempt
      const path = window.location.pathname;
      const url = error.config?.url || '';

      const isAuthPage = path === '/' || path === '/login' || path.includes('login');
      const isLoginRequest = url.includes('/auth/login') || url.includes('login');

      console.log('401 Interceptor:', { path, url, isAuthPage, isLoginRequest });

      if (!isAuthPage && !isLoginRequest) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/';
      }
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
