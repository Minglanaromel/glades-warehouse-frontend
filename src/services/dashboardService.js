import api from './api';

const dashboardService = {
  // Get dashboard layout
  getDashboard: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update dashboard layout
  updateLayout: async (widgets, layout) => {
    try {
      const response = await api.put('/dashboard/layout', { widgets, layout });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default dashboardService;