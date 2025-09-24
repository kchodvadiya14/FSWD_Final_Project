# Complete Code Examples for MERN Fitness Tracking Application

## Mongoose Models

### 1. Enhanced User Model
```javascript
// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    validate: {
      validator: function(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
      },
      message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    }
  },
  avatar: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  profile: {
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age cannot exceed 120']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    height: {
      value: {
        type: Number,
        required: true,
        min: [50, 'Height must be at least 50cm']
      },
      unit: {
        type: String,
        enum: ['cm', 'ft'],
        default: 'cm'
      }
    },
    currentWeight: {
      value: {
        type: Number,
        required: true,
        min: [20, 'Weight must be at least 20kg']
      },
      unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
      }
    },
    targetWeight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
      },
      deadline: Date
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'super_active'],
      required: true
    },
    fitnessGoal: {
      type: String,
      enum: ['lose_weight', 'gain_weight', 'build_muscle', 'improve_fitness', 'maintain_weight'],
      required: true
    },
    preferences: {
      units: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric'
      },
      timezone: {
        type: String,
        default: 'UTC'
      },
      language: {
        type: String,
        default: 'en'
      }
    }
  },
  
  settings: {
    notifications: {
      workoutReminders: { type: Boolean, default: true },
      nutritionAlerts: { type: Boolean, default: true },
      progressUpdates: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'private'
      },
      shareProgress: { type: Boolean, default: false }
    }
  },
  
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'profile.fitnessGoal': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for BMI calculation
userSchema.virtual('profile.bmi').get(function() {
  if (!this.profile.height?.value || !this.profile.currentWeight?.value) return null;
  
  const heightInM = this.profile.height.unit === 'cm' 
    ? this.profile.height.value / 100 
    : this.profile.height.value * 0.3048;
  const weightInKg = this.profile.currentWeight.unit === 'kg'
    ? this.profile.currentWeight.value
    : this.profile.currentWeight.value * 0.453592;
    
  return Math.round((weightInKg / (heightInM * heightInM)) * 10) / 10;
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

export default mongoose.model('User', userSchema);
```

### 2. Workout Model
```javascript
// models/Workout.js
import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    min: [0, 'Reps cannot be negative']
  },
  weight: {
    value: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  duration: {
    type: Number, // seconds
    min: [0, 'Duration cannot be negative']
  },
  distance: {
    value: {
      type: Number,
      min: [0, 'Distance cannot be negative']
    },
    unit: {
      type: String,
      enum: ['km', 'miles', 'm', 'ft'],
      default: 'km'
    }
  },
  restTime: {
    type: Number, // seconds
    default: 60
  },
  notes: String,
  completed: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const exerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sets: [setSchema],
  notes: String,
  personalRecord: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true,
    maxlength: [100, 'Workout name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'sports', 'other'],
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  startTime: Date,
  endTime: Date,
  duration: Number, // minutes, calculated field
  
  exercises: [exerciseSchema],
  
  metrics: {
    totalCaloriesBurned: {
      type: Number,
      min: [0, 'Calories cannot be negative']
    },
    averageHeartRate: {
      type: Number,
      min: [40, 'Heart rate too low'],
      max: [220, 'Heart rate too high']
    },
    maxHeartRate: {
      type: Number,
      min: [40, 'Heart rate too low'],
      max: [220, 'Heart rate too high']
    },
    totalSteps: {
      type: Number,
      min: [0, 'Steps cannot be negative']
    },
    totalDistance: {
      value: {
        type: Number,
        min: [0, 'Distance cannot be negative']
      },
      unit: {
        type: String,
        enum: ['km', 'miles'],
        default: 'km'
      }
    }
  },
  
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'average', 'poor', 'terrible']
  },
  difficultyRating: {
    type: Number,
    min: [1, 'Rating must be between 1 and 10'],
    max: [10, 'Rating must be between 1 and 10']
  },
  
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateName: String,
  
  completedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
workoutSchema.index({ userId: 1, date: -1 });
workoutSchema.index({ userId: 1, type: 1 });
workoutSchema.index({ date: -1 });

// Virtual for total volume
workoutSchema.virtual('totalVolume').get(function() {
  return this.exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      if (set.weight?.value && set.reps) {
        return setTotal + (set.weight.value * set.reps);
      }
      return setTotal;
    }, 0);
    return total + exerciseVolume;
  }, 0);
});

// Pre-save middleware to calculate duration
workoutSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // minutes
  }
  next();
});

export default mongoose.model('Workout', workoutSchema);
```

### 3. Exercise Library Model
```javascript
// models/Exercise.js
import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'flexibility'],
    required: true
  },
  muscleGroups: [{
    type: String,
    enum: [
      'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
      'quadriceps', 'hamstrings', 'calves', 'glutes', 'abs', 'obliques',
      'traps', 'lats', 'delts'
    ]
  }],
  equipment: [{
    type: String,
    enum: [
      'bodyweight', 'dumbbell', 'barbell', 'kettlebell', 'cable',
      'machine', 'resistance_band', 'pull_up_bar', 'bench', 'ball'
    ]
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  
  instructions: [{
    type: String,
    required: true
  }],
  tips: [String],
  
  media: {
    images: [String],
    videos: [{
      url: String,
      type: {
        type: String,
        enum: ['demonstration', 'tutorial']
      },
      duration: Number // seconds
    }],
    animations: [String] // GIF URLs
  },
  
  metrics: {
    defaultSets: {
      type: Number,
      default: 3,
      min: 1
    },
    defaultReps: {
      type: Number,
      default: 10,
      min: 1
    },
    defaultDuration: Number, // seconds for time-based exercises
    caloriesPerMinute: {
      type: Number,
      min: 0
    }
  },
  
  variations: [{
    name: String,
    description: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  }],
  
  isApproved: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Analytics
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
exerciseSchema.index({ category: 1, difficulty: 1 });
exerciseSchema.index({ muscleGroups: 1 });
exerciseSchema.index({ equipment: 1 });
exerciseSchema.index({ name: 'text', category: 'text' });
exerciseSchema.index({ isApproved: 1 });

export default mongoose.model('Exercise', exerciseSchema);
```

## API Controllers

### 1. Enhanced Auth Controller
```javascript
// controllers/authController.js
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d'
  });
};

// Register new user
export const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      profile: profile || {}
    };

    const user = new User(userData);
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Send verification email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email - NutriFit',
      template: 'emailVerification',
      data: {
        name: user.name,
        verificationUrl: `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
      }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        user,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      }
      
      await user.save();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['name', 'profile', 'settings'];
    const updates = {};

    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Generate new access token
    const newToken = generateToken(decoded.userId);

    res.json({
      success: true,
      data: { token: newToken }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};
```

### 2. Workout Controller
```javascript
// controllers/workoutController.js
import Workout from '../models/Workout.js';
import Exercise from '../models/Exercise.js';
import { validationResult } from 'express-validator';

// Get user workouts with pagination and filters
export const getWorkouts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      startDate,
      endDate,
      search
    } = req.query;

    // Build filter object
    const filter = { userId: req.user.userId };

    if (type) filter.type = type;
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const workouts = await Workout.find(filter)
      .populate('exercises.exerciseId', 'name category muscleGroups')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Workout.countDocuments(filter);

    // Calculate statistics
    const stats = await Workout.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          averageDuration: { $avg: '$duration' },
          totalCalories: { $sum: '$metrics.totalCaloriesBurned' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        workouts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        stats: stats[0] || {
          totalWorkouts: 0,
          totalDuration: 0,
          averageDuration: 0,
          totalCalories: 0
        }
      }
    });

  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create new workout
export const createWorkout = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const workoutData = {
      ...req.body,
      userId: req.user.userId
    };

    // Validate exercises exist
    if (workoutData.exercises && workoutData.exercises.length > 0) {
      const exerciseIds = workoutData.exercises.map(ex => ex.exerciseId);
      const validExercises = await Exercise.find({ _id: { $in: exerciseIds } });
      
      if (validExercises.length !== exerciseIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more exercises not found'
        });
      }
    }

    const workout = new Workout(workoutData);
    await workout.save();

    // Populate exercise details
    await workout.populate('exercises.exerciseId', 'name category muscleGroups');

    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      data: { workout }
    });

  } catch (error) {
    console.error('Create workout error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get workout analytics
export const getWorkoutAnalytics = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    const analytics = await Workout.aggregate([
      {
        $match: {
          userId: req.user.userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            type: "$type"
          },
          count: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
          totalCalories: { $sum: "$metrics.totalCaloriesBurned" }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          workouts: {
            $push: {
              type: "$_id.type",
              count: "$count",
              duration: "$totalDuration",
              calories: "$totalCalories"
            }
          },
          totalWorkouts: { $sum: "$count" },
          totalDuration: { $sum: "$totalDuration" },
          totalCalories: { $sum: "$totalCalories" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: { analytics, timeframe }
    });

  } catch (error) {
    console.error('Get workout analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

## React Components

### 1. Workout Logger Component
```jsx
// components/workouts/WorkoutLogger.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { workoutService } from '../../services/workoutService';
import ExerciseSelector from './ExerciseSelector';
import SetTracker from './SetTracker';
import Timer from '../common/Timer';

const WorkoutLogger = () => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState({
    name: '',
    type: 'strength',
    exercises: [],
    startTime: null,
    endTime: null,
    notes: ''
  });
  const [isActive, setIsActive] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [saving, setSaving] = useState(false);

  // Start workout timer
  const startWorkout = () => {
    if (!workout.startTime) {
      setWorkout(prev => ({
        ...prev,
        startTime: new Date()
      }));
    }
    setIsActive(true);
  };

  // Pause workout timer
  const pauseWorkout = () => {
    setIsActive(false);
  };

  // Add exercise to workout
  const addExercise = (exercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        exerciseId: exercise._id,
        name: exercise.name,
        sets: [{
          reps: '',
          weight: { value: '', unit: 'kg' },
          restTime: 60,
          completed: false
        }]
      }]
    }));
    setShowExerciseSelector(false);
  };

  // Add set to exercise
  const addSet = (exerciseIndex, setData) => {
    setWorkout(prev => {
      const updated = { ...prev };
      updated.exercises[exerciseIndex].sets.push({
        ...setData,
        completed: false
      });
      return updated;
    });
  };

  // Update set data
  const updateSet = (exerciseIndex, setIndex, updates) => {
    setWorkout(prev => {
      const updated = { ...prev };
      updated.exercises[exerciseIndex].sets[setIndex] = {
        ...updated.exercises[exerciseIndex].sets[setIndex],
        ...updates
      };
      return updated;
    });
  };

  // Complete set
  const completeSet = (exerciseIndex, setIndex) => {
    updateSet(exerciseIndex, setIndex, { completed: true });
    toast.success('Set completed!');
  };

  // Remove exercise
  const removeExercise = (exerciseIndex) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, index) => index !== exerciseIndex)
    }));
  };

  // Save workout
  const saveWorkout = async () => {
    if (workout.exercises.length === 0) {
      toast.error('Add at least one exercise to save workout');
      return;
    }

    setSaving(true);
    try {
      const workoutData = {
        ...workout,
        endTime: new Date(),
        date: new Date(),
        exercises: workout.exercises.filter(ex => ex.sets.length > 0)
      };

      await workoutService.createWorkout(workoutData);
      toast.success('Workout saved successfully!');
      navigate('/workouts');
    } catch (error) {
      toast.error('Failed to save workout');
      console.error('Save workout error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Calculate total duration
  const getDuration = () => {
    if (!workout.startTime) return 0;
    const endTime = isActive ? new Date() : (workout.endTime || new Date());
    return Math.floor((endTime - workout.startTime) / 1000 / 60);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <input
              type="text"
              placeholder="Workout name"
              value={workout.name}
              onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
              className="text-2xl font-bold border-none outline-none bg-transparent placeholder-gray-400"
            />
            <p className="text-gray-600">
              {workout.exercises.length} exercises • {getDuration()} minutes
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Timer
              startTime={workout.startTime}
              isActive={isActive}
              className="text-2xl font-mono"
            />
            
            <div className="flex space-x-2">
              {!isActive ? (
                <button
                  onClick={startWorkout}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  {workout.startTime ? 'Resume' : 'Start'}
                </button>
              ) : (
                <button
                  onClick={pauseWorkout}
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  <PauseIcon className="w-5 h-5 mr-2" />
                  Pause
                </button>
              )}
              
              <button
                onClick={saveWorkout}
                disabled={saving || workout.exercises.length === 0}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <StopIcon className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : 'Finish'}
              </button>
            </div>
          </div>
        </div>
        
        <select
          value={workout.type}
          onChange={(e) => setWorkout(prev => ({ ...prev, type: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="strength">Strength Training</option>
          <option value="cardio">Cardio</option>
          <option value="flexibility">Flexibility</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Add Exercise Button */}
      <button
        onClick={() => setShowExerciseSelector(true)}
        className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
      >
        <PlusIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600">Add Exercise</p>
      </button>

      {/* Exercise List */}
      <div className="space-y-6">
        {workout.exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{exercise.name}</h3>
              <button
                onClick={() => removeExercise(exerciseIndex)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            
            <SetTracker
              sets={exercise.sets}
              onAddSet={(setData) => addSet(exerciseIndex, setData)}
              onUpdateSet={(setIndex, updates) => updateSet(exerciseIndex, setIndex, updates)}
              onCompleteSet={(setIndex) => completeSet(exerciseIndex, setIndex)}
            />
          </div>
        ))}
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <ExerciseSelector
          onSelect={addExercise}
          onClose={() => setShowExerciseSelector(false)}
          excludeIds={workout.exercises.map(ex => ex.exerciseId)}
        />
      )}

      {/* Notes */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workout Notes
        </label>
        <textarea
          value={workout.notes}
          onChange={(e) => setWorkout(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="How did this workout feel? Any observations?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default WorkoutLogger;
```

### 2. Progress Chart Component
```jsx
// components/charts/ProgressChart.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { progressService } from '../../services/progressService';
import { format, subDays, subMonths } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressChart = ({ 
  metric = 'weight', 
  timeframe = '3months',
  height = 400,
  showGoal = true 
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgressData();
  }, [metric, timeframe]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const endDate = new Date();
      let startDate;
      
      switch (timeframe) {
        case '1month':
          startDate = subMonths(endDate, 1);
          break;
        case '3months':
          startDate = subMonths(endDate, 3);
          break;
        case '6months':
          startDate = subMonths(endDate, 6);
          break;
        case '1year':
          startDate = subMonths(endDate, 12);
          break;
        default:
          startDate = subMonths(endDate, 3);
      }

      const progressData = await progressService.getProgressHistory({
        metric,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      setData(processChartData(progressData));
      setError(null);
    } catch (err) {
      setError('Failed to load progress data');
      console.error('Progress chart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (progressData) => {
    if (!progressData || progressData.length === 0) {
      return null;
    }

    // Sort by date
    const sortedData = progressData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Extract values based on metric
    const labels = sortedData.map(entry => format(new Date(entry.date), 'MMM dd'));
    const values = sortedData.map(entry => {
      switch (metric) {
        case 'weight':
          return entry.measurements?.weight?.value || null;
        case 'bodyFat':
          return entry.measurements?.bodyFat || null;
        case 'muscleMass':
          return entry.measurements?.muscleMass || null;
        case 'bmi':
          return entry.measurements?.bmi || null;
        default:
          return null;
      }
    }).filter(value => value !== null);

    // Calculate trend line
    const trendLine = calculateTrendLine(values);

    return {
      labels,
      datasets: [
        {
          label: getMetricLabel(metric),
          data: values,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Trend',
          data: trendLine,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0
        }
      ]
    };
  };

  const calculateTrendLine = (values) => {
    if (values.length < 2) return values;

    const n = values.length;
    const xSum = (n * (n - 1)) / 2;
    const ySum = values.reduce((sum, value) => sum + value, 0);
    const xySum = values.reduce((sum, value, index) => sum + value * index, 0);
    const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    return values.map((_, index) => slope * index + intercept);
  };

  const getMetricLabel = (metric) => {
    const labels = {
      weight: 'Weight (kg)',
      bodyFat: 'Body Fat (%)',
      muscleMass: 'Muscle Mass (kg)',
      bmi: 'BMI'
    };
    return labels[metric] || metric;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: `${getMetricLabel(metric)} Progress`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        beginAtZero: false
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-red-600" style={{ height }}>
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center text-gray-500" style={{ height }}>
        No progress data available
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <Line data={data} options={chartOptions} />
    </div>
  );
};

export default ProgressChart;
```

This comprehensive guide provides:

✅ **Complete Database Schema** with indexes and relationships  
✅ **RESTful API Architecture** with authentication and validation  
✅ **Modular React Components** with hooks and context  
✅ **Modern Library Recommendations** for all features  
✅ **Production-Ready Code Examples** with error handling  

Your NutriFit application now has a complete blueprint for scaling into a full-featured fitness tracking platform! 🚀