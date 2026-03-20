import api from './api';

export const dashboardService = {
  // Get main dashboard data
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Dashboard service error:', error);
      throw error;
    }
  },

  // Get KPI metrics
  getKPIMetrics: async (period = 'month') => {
    try {
      const response = await api.get(`/dashboard/kpi?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('KPI metrics error:', error);
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Recent activities error:', error);
      throw error;
    }
  },

  // Get production metrics
  getProductionMetrics: async () => {
    try {
      const response = await api.get('/dashboard/production');
      return response.data;
    } catch (error) {
      console.error('Production metrics error:', error);
      throw error;
    }
  },

  // Get OTIF data
  getOTIFData: async () => {
    try {
      const response = await api.get('/dashboard/otif');
      return response.data;
    } catch (error) {
      console.error('OTIF data error:', error);
      throw error;
    }
  },

  // Get attendance data
  getAttendanceData: async () => {
    try {
      const response = await api.get('/dashboard/attendance');
      return response.data;
    } catch (error) {
      console.error('Attendance data error:', error);
      throw error;
    }
  },

  // Get downtime data
  getDowntimeData: async () => {
    try {
      const response = await api.get('/dashboard/downtime');
      return response.data;
    } catch (error) {
      console.error('Downtime data error:', error);
      throw error;
    }
  }
};

export default dashboardService;