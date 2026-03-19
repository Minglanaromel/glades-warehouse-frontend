import api from './api';

const cctvService = {
  // Get all cameras
  getCameras: async () => {
    try {
      const response = await api.get('/cctv');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get camera by ID
  getCameraById: async (id) => {
    try {
      const response = await api.get(`/cctv/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create camera
  createCamera: async (cameraData) => {
    try {
      const response = await api.post('/cctv', cameraData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update camera
  updateCamera: async (id, cameraData) => {
    try {
      const response = await api.put(`/cctv/${id}`, cameraData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update camera status
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/cctv/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete camera
  deleteCamera: async (id) => {
    try {
      const response = await api.delete(`/cctv/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add recording
  addRecording: async (id, recordingData) => {
    try {
      const response = await api.post(`/cctv/${id}/recordings`, recordingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default cctvService; 