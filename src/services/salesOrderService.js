import api from './api';

const salesOrderService = {
  // Get all sales orders with pagination
  getSalesOrders: async (page = 1, status = '') => {
    try {
      const response = await api.get('/sales-orders', {
        params: { page, status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single sales order
  getSalesOrderById: async (id) => {
    try {
      const response = await api.get(`/sales-orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create sales order
  createSalesOrder: async (orderData) => {
    try {
      const response = await api.post('/sales-orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update sales order
  updateSalesOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/sales-orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update sales order status
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/sales-orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      const response = await api.put(`/sales-orders/${id}/payment`, { paymentStatus });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete sales order
  deleteSalesOrder: async (id) => {
    try {
      const response = await api.delete(`/sales-orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default salesOrderService;