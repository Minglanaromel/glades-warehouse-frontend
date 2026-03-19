import api from './api';

const supplierService = {
  // Get all suppliers with pagination
  getSuppliers: async (page = 1, keyword = '') => {
    try {
      const response = await api.get('/suppliers', {
        params: { page, keyword }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single supplier
  getSupplierById: async (id) => {
    try {
      const response = await api.get(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create supplier
  createSupplier: async (supplierData) => {
    try {
      const response = await api.post('/suppliers', supplierData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update supplier
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete supplier
  deleteSupplier: async (id) => {
    try {
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Import suppliers from Excel
  importSuppliers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/suppliers/import', formData, {
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

export default supplierService;