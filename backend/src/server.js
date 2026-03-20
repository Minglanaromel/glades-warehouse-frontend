// src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const excelRoutes = require('./routes/excelRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Create uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create data directory
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_ALT, 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('📡 Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('📡 Client disconnected:', socket.id);
  });
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  message: 'Too many requests'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_ALT, 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(uploadsDir));

// Apply rate limiting
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.url} not found` 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🏭 GLADES INTERNATIONAL CORPORATION');
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`📁 Upload directory: ${uploadsDir}`);
  console.log(`💾 Data directory: ${dataDir}`);
  console.log('='.repeat(50));
});