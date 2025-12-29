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
    // Redirect to user controller's invest method which handles balance checks
    const response = await api.post('/user/invest', investmentData);
    return response.data;
  },

  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getOpportunities: async () => {
    const response = await api.get('/opportunities');
    return response.data;
  },

  // New Investment System Methods
  getPlans: async () => {
    const response = await api.get('/investments/plans/list');
    return response.data;
  },

  invest: async (data) => {
    const response = await api.post('/investments/invest', data);
    return response.data;
  },

  getMyInvestments: async () => {
    const response = await api.get('/investments/my/investments');
    return response.data;
  },

  withdrawInvestment: async (investmentId) => {
    const response = await api.post(`/user/investments/${investmentId}/withdraw`);
    return response.data;
  },

  getPayoutHistory: async () => {
    const response = await api.get('/user/investments/payouts/history');
    return response.data;
  }
};
