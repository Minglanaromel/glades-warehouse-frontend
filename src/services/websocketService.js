import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const baseURL = API_URL.replace('/api', '');
    
    this.socket = io(baseURL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      
      // Join user room
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?._id) {
        this.socket.emit('join', user._id);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Setup listeners
    this.socket.on('new_message', (data) => {
      this.emit('new_message', data);
    });

    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });

    this.socket.on('message_read', (data) => {
      this.emit('message_read', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
    }
  }

  sendNotification(notificationData) {
    if (this.socket) {
      this.socket.emit('send_notification', notificationData);
    }
  }
}

export default new WebSocketService();