import api from './api';

const stockItemService = {
  // Get all stock items with pagination
  getStockItems: async (page = 1, keyword = '') => {
    try {
      const response = await api.get('/stock-items', {
        params: { page, keyword }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get low stock items
  getLowStockItems: async () => {
    try {
      const response = await api.get('/stock-items/low-stock');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single stock item
  getStockItemById: async (id) => {
    try {
      const response = await api.get(`/stock-items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create stock item
  createStockItem: async (itemData) => {
    try {
      const response = await api.post('/stock-items', itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update stock item
  updateStockItem: async (id, itemData) => {
    try {
      const response = await api.put(`/stock-items/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update stock quantity
  updateQuantity: async (id, quantity, operation = 'set') => {
    try {
      const response = await api.put(`/stock-items/${id}/quantity`, {
        quantity,
        operation
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete stock item
  deleteStockItem: async (id) => {
    try {
      const response = await api.delete(`/stock-items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Import stock items from Excel
  importStockItems: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/stock-items/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default stockItemService;