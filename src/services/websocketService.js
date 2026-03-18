// services/websocketService.js
import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) return;

    this.socket = io('http://localhost:3002', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('excel-updated', (data) => {
      // Notify all listeners
      this.listeners.forEach((callback, event) => {
        if (event === 'excel-updated') {
          callback(data);
        }
      });
    });

    this.socket.on('machine-status-updated', (data) => {
      this.listeners.forEach((callback, event) => {
        if (event === 'machine-status') {
          callback(data);
        }
      });
    });

    this.socket.on('downtime-updated', (data) => {
      this.listeners.forEach((callback, event) => {
        if (event === 'downtime') {
          callback(data);
        }
      });
    });

    this.socket.on('attendance-updated', (data) => {
      this.listeners.forEach((callback, event) => {
        if (event === 'attendance') {
          callback(data);
        }
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    this.listeners.set(event, callback);
  }

  off(event) {
    this.listeners.delete(event);
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Specific methods for Excel data
  requestExcelData() {
    this.emit('request-excel-data');
  }

  requestMachineStatus() {
    this.emit('request-machine-status');
  }

  requestDowntime() {
    this.emit('request-downtime');
  }

  requestAttendance() {
    this.emit('request-attendance');
  }
}

export default new WebSocketService();