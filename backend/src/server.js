const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { testConnection } = require('./database/connection');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profiles');
const hashtagRoutes = require('./routes/hashtags');
const connectionRoutes = require('./routes/connections');
const discoveryRoutes = require('./routes/discovery');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/hashtags', hashtagRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/discovery', discoveryRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user to their personal room
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined personal room`);
  });

  // Handle joining chat rooms
  socket.on('join_room', (roomId) => {
    socket.join(`room_${roomId}`);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Handle leaving chat rooms
  socket.on('leave_room', (roomId) => {
    socket.leave(`room_${roomId}`);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  // Handle private messages
  socket.on('private_message', (data) => {
    io.to(`user_${data.receiverId}`).emit('new_message', {
      id: data.id,
      senderId: data.senderId,
      content: data.content,
      createdAt: data.createdAt
    });
  });

  // Handle room messages
  socket.on('room_message', (data) => {
    socket.to(`room_${data.roomId}`).emit('room_message', {
      id: data.id,
      userId: data.userId,
      username: data.username,
      content: data.content,
      createdAt: data.createdAt
    });
  });

  // Handle connection requests
  socket.on('connection_request', (data) => {
    io.to(`user_${data.addresseeId}`).emit('connection_request', {
      id: data.id,
      requesterId: data.requesterId,
      requesterName: data.requesterName,
      message: data.message,
      createdAt: data.createdAt
    });
  });

  // Handle connection acceptance
  socket.on('connection_accepted', (data) => {
    io.to(`user_${data.requesterId}`).emit('connection_accepted', {
      id: data.id,
      addresseeName: data.addresseeName,
      createdAt: data.createdAt
    });
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    socket.to(`user_${data.receiverId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`user_${data.receiverId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: false
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📖 API Documentation: http://localhost:${PORT}/health`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

if (require.main === module) {
  startServer();
}

module.exports = { app, io, server }; 