import api from './api';
import toast from 'react-hot-toast';

const customerService = {
  // Get all customers with pagination and search
  getCustomers: async (page = 1, keyword = '', status = '') => {
    try {
      const response = await api.get('/customers', {
        params: { 
          page, 
          keyword,
          status 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error.response?.data || { message: 'Failed to fetch customers' };
    }
  },

  // Get single customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error.response?.data || { message: 'Failed to fetch customer' };
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      toast.success('Customer created successfully!');
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create customer';
      toast.error(errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      toast.success('Customer updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update customer';
      toast.error(errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      toast.success('Customer deleted successfully!');
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete customer';
      toast.error(errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // Import customers from Excel
  importCustomers: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/customers/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.errors?.length > 0) {
        toast.warning(`Imported ${response.data.imported} customers. ${response.data.errors.length} errors.`);
      } else {
        toast.success(`Successfully imported ${response.data.imported} customers!`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error importing customers:', error);
      const errorMessage = error.response?.data?.message || 'Failed to import customers';
      toast.error(errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // Export customers to Excel
  exportCustomers: async () => {
    try {
      const response = await api.get('/customers/export', {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Customers exported successfully!');
      return true;
    } catch (error) {
      console.error('Error exporting customers:', error);
      toast.error('Failed to export customers');
      throw error.response?.data || { message: 'Failed to export customers' };
    }
  },

  // Search customers by name/code/email
  searchCustomers: async (query) => {
    try {
      const response = await api.get('/customers/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error.response?.data || { message: 'Failed to search customers' };
    }
  },

  // Get customer statistics
  getCustomerStats: async () => {
    try {
      const response = await api.get('/customers/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error.response?.data || { message: 'Failed to fetch customer statistics' };
    }
  },

  // Bulk delete customers
  bulkDeleteCustomers: async (ids) => {
    try {
      const response = await api.post('/customers/bulk-delete', { ids });
      toast.success(`${response.data.deleted} customers deleted successfully!`);
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting customers:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete customers';
      toast.error(errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // Toggle customer status (active/inactive)
  toggleCustomerStatus: async (id) => {
    try {
      const response = await api.put(`/customers/${id}/toggle-status`);
      toast.success(`Customer status updated!`);
      return response.data;
    } catch (error) {
      console.error('Error toggling customer status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // Get customer purchase history
  getCustomerHistory: async (id) => {
    try {
      const response = await api.get(`/customers/${id}/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer history:', error);
      throw error.response?.data || { message: 'Failed to fetch customer history' };
    }
  },

  // Validate GST number
  validateGST: async (gstNo) => {
    try {
      const response = await api.get('/customers/validate-gst', {
        params: { gstNo }
      });
      return response.data;
    } catch (error) {
      console.error('Error validating GST:', error);
      throw error.response?.data || { message: 'Failed to validate GST' };
    }
  }
};

export default customerService;