import api from './api';

const messageService = {
  // Get all messages
  getMessages: async (page = 1) => {
    try {
      const response = await api.get('/messages', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single message
  getMessageById: async (id) => {
    try {
      const response = await api.get(`/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete message
  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/messages/unread/count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default messageService;