import api from './api';

export const investmentService = {
  getAll: async () => {
    const response = await api.get('/investments');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/investments/${id}`);
    return response.data;
  },

  create: async (investmentData) => {
    const response = await api.post('/investments', investmentData);
    return response.data;
  },

  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getOpportunities: async () => {
    const response = await api.get('/opportunities');
    return response.data;
  }
};
