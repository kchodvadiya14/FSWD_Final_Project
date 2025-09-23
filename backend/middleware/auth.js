import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid - user not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Middleware to verify admin role (optional for future admin features)
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization failed'
    });
  }
};

// Middleware to check if user owns the resource
export const checkResourceOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    try {
      const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
      
      if (!resourceUserId) {
        return res.status(400).json({
          success: false,
          message: 'Resource user ID is required'
        });
      }

      if (resourceUserId.toString() !== req.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied - you can only access your own data'
        });
      }

      next();
    } catch (error) {
      console.error('Resource ownership check error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};

// Middleware to validate JWT token without requiring authentication (for optional auth)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    }
    
    next();
  } catch (error) {
    // Don't throw error for optional auth, just continue without user
    next();
  }
};

// Generate JWT token
export const generateToken = (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
  
  return token;
};

// Verify token utility function
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
