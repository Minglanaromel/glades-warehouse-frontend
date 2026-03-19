import api from './api';

const purchaseOrderService = {
  // Get all purchase orders with pagination
  getPurchaseOrders: async (page = 1, status = '') => {
    try {
      const response = await api.get('/purchase-orders', {
        params: { page, status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single purchase order
  getPurchaseOrderById: async (id) => {
    try {
      const response = await api.get(`/purchase-orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create purchase order
  createPurchaseOrder: async (orderData) => {
    try {
      const response = await api.post('/purchase-orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update purchase order
  updatePurchaseOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/purchase-orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update purchase order status
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/purchase-orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete purchase order
  deletePurchaseOrder: async (id) => {
    try {
      const response = await api.delete(`/purchase-orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default purchaseOrderService;