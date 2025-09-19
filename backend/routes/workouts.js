import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
  duplicateWorkout,
  getWorkoutTemplates
} from '../controllers/workoutController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation rules
const createWorkoutValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('startTime')
    .optional()
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  body('endTime')
    .optional()
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date'),
  body('totalDuration.value')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Total duration must be at least 1 minute'),
  body('totalDuration.unit')
    .optional()
    .isIn(['minutes', 'hours'])
    .withMessage('Duration unit must be minutes or hours'),
  body('exercises')
    .isArray({ min: 1 })
    .withMessage('At least one exercise is required'),
  body('exercises.*.name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Exercise name is required'),
  body('exercises.*.category')
    .isIn(['cardio', 'strength', 'flexibility', 'sports', 'other'])
    .withMessage('Invalid exercise category'),
  body('exercises.*.duration.value')
    .isFloat({ min: 1 })
    .withMessage('Exercise duration must be at least 1 minute'),
  body('exercises.*.intensity')
    .optional()
    .isIn(['low', 'moderate', 'high', 'very_high'])
    .withMessage('Invalid exercise intensity'),
  body('exercises.*.caloriesBurned')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Calories burned cannot be negative'),
  body('workoutType')
    .optional()
    .isIn(['cardio', 'strength', 'flexibility', 'mixed', 'sports'])
    .withMessage('Invalid workout type'),
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  body('location')
    .optional()
    .isIn(['home', 'gym', 'outdoor', 'office', 'other'])
    .withMessage('Invalid location'),
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('tags.*')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters')
];

const updateWorkoutValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid workout ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('exercises')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one exercise is required'),
  body('exercises.*.name')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Exercise name is required'),
  body('exercises.*.category')
    .optional()
    .isIn(['cardio', 'strength', 'flexibility', 'sports', 'other'])
    .withMessage('Invalid exercise category'),
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

const getWorkoutsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(['date', 'title', 'totalCaloriesBurned', 'totalDuration', 'rating', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('workoutType')
    .optional()
    .isIn(['cardio', 'strength', 'flexibility', 'mixed', 'sports', 'all'])
    .withMessage('Invalid workout type filter'),
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid ISO 8601 date'),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid ISO 8601 date')
];

const workoutStatsValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('groupBy')
    .optional()
    .isIn(['day', 'week', 'month'])
    .withMessage('Group by must be day, week, or month')
];

const duplicateWorkoutValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid workout ID'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
];

const workoutTemplatesValidation = [
  query('category')
    .optional()
    .isIn(['cardio', 'strength', 'flexibility', 'mixed', 'sports', 'all'])
    .withMessage('Invalid category filter'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid workout ID')
];

// Routes
router.get('/', getWorkoutsValidation, getWorkouts);
router.get('/stats', workoutStatsValidation, getWorkoutStats);
router.get('/templates', workoutTemplatesValidation, getWorkoutTemplates);
router.get('/:id', mongoIdValidation, getWorkout);
router.post('/', createWorkoutValidation, createWorkout);
router.put('/:id', updateWorkoutValidation, updateWorkout);
router.delete('/:id', mongoIdValidation, deleteWorkout);
router.post('/:id/duplicate', duplicateWorkoutValidation, duplicateWorkout);

export default router;
