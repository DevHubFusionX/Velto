import axios from 'axios';
import { toast } from '../utils/toastEmitter';

const rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = rawBaseURL ? (rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`) : undefined;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
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
    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');

      const path = window.location.pathname;
      const url = error.config?.url || '';
      const isAuthPage = path === '/' || path === '/login' || path.includes('login');
      const isLoginRequest = url.includes('/auth/login') || url.includes('login');

      if (!isAuthPage && !isLoginRequest) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/';
      }
    } else if (error.response?.status === 403 && message.toLowerCase().includes('suspended')) {
      sessionStorage.removeItem('token');
      toast.error(message);
      setTimeout(() => { window.location.href = '/'; }, 2000);
    } else if (error.response?.status === 503) {
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
