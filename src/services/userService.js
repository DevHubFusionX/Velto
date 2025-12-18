import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/user/dashboard');
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/user/notifications');
    return response.data;
  },

  markNotificationRead: async (id) => {
    const response = await api.put(`/user/notifications/${id}/read`);
    return response.data;
  }
};
