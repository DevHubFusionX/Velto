import api from './api';

let _dashboardCache = null;
let _dashboardCacheTime = null;

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },

  getDashboard: async (forceRefresh = false) => {
    // Return cached data if it's less than 30 seconds old
    if (!forceRefresh && _dashboardCache && (Date.now() - _dashboardCacheTime < 30000)) {
      return _dashboardCache;
    }

    const response = await api.get('/user/dashboard');
    _dashboardCache = response.data;
    _dashboardCacheTime = Date.now();
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/user/notifications');
    return response.data;
  },

  markNotificationRead: async (id) => {
    const response = await api.put(`/user/notifications/${id}/read`);
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/user/settings');
    return response.data;
  },

  deposit: async (amount, method, currency) => {
    const response = await api.post('/user/deposit', { amount, method, currency });
    return response.data;
  },

  withdraw: async (amount, bankDetails, currency) => {
    const response = await api.post('/user/withdraw', { amount, bankDetails, currency });
    return response.data;
  },

  getTransactions: async (params = {}) => {
    const response = await api.get('/user/transactions', { params });
    return response.data;
  },

  invest: async (investmentData) => {
    const response = await api.post('/user/invest', investmentData);
    return response.data;
  }
};
