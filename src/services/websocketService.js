class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000;
  }

  connect(channel) {
    const wsUrl = process.env.REACT_APP_WS_URL || `ws://${window.location.hostname}:5000`;
    this.socket = new WebSocket(`${wsUrl}?channel=${channel}`);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect();
    };
    
    return this.socket;
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, this.reconnectDelay);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();