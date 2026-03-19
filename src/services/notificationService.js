import api from './api';

const notificationService = {
  // Get all notifications
  getNotifications: async (page = 1) => {
    try {
      const response = await api.get('/notifications', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread/count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default notificationService;