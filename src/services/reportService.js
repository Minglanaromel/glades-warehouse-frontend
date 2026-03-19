import api from './api';

const reportService = {
  // Get stock report
  getStockReport: async (format = 'json') => {
    try {
      const response = await api.get('/reports/stock', {
        params: { format }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get purchase report
  getPurchaseReport: async (startDate, endDate, format = 'json') => {
    try {
      const response = await api.get('/reports/purchases', {
        params: { startDate, endDate, format }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get sales report
  getSalesReport: async (startDate, endDate, format = 'json') => {
    try {
      const response = await api.get('/reports/sales', {
        params: { startDate, endDate, format }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download report as Excel
  downloadExcel: async (reportType, params = {}) => {
    try {
      const response = await api.get(`/reports/${reportType}`, {
        params: { ...params, format: 'excel' },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default reportService;