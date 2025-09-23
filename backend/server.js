import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import workoutRoutes from './routes/workouts.js';
import nutritionRoutes from './routes/nutrition.js';
import metricsRoutes from './routes/metrics.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (before database middleware)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    message: 'NutriFit API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Database connection check middleware (only for routes that need database)
const dbRoutes = ['/api/auth', '/api/users', '/api/workouts', '/api/nutrition', '/api/metrics'];
app.use(dbRoutes, (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection not available. Please try again later.',
      code: 'DB_UNAVAILABLE'
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/metrics', metricsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutrifit', {
      connectTimeoutMS: 10000, // 10 second timeout
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      w: 'majority'
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    return false;
  }
};

// Start server
const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    console.log('✅ MongoDB connected successfully');
  } else {
    console.log('❌ MongoDB connection failed, starting server without database');
    console.log('📝 You can set up MongoDB later and restart the server');
    console.log('🔧 To fix this: Install and start MongoDB locally or use MongoDB Atlas');
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 NutriFit Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5174'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
