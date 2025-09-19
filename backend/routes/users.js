import express from 'express';
import { body, query } from 'express-validator';
import {
  getDashboard,
  getStats,
  getProgress,
  updatePreferences,
  deleteAccount
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation rules
const statsValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

const progressValidation = [
  query('metric')
    .optional()
    .isIn(['weight', 'bodyFat', 'sleep', 'workouts', 'nutrition'])
    .withMessage('Invalid metric specified'),
  query('period')
    .optional()
    .isIn(['1m', '3m', '6m', '1y'])
    .withMessage('Invalid period specified')
];

const dashboardValidation = [
  query('timeRange')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Invalid time range specified')
];

const preferencesValidation = [
  body('preferences.units.weight')
    .optional()
    .isIn(['kg', 'lbs'])
    .withMessage('Invalid weight unit'),
  body('preferences.units.height')
    .optional()
    .isIn(['cm', 'ft'])
    .withMessage('Invalid height unit'),
  body('preferences.units.distance')
    .optional()
    .isIn(['km', 'miles'])
    .withMessage('Invalid distance unit'),
  body('preferences.notifications.workoutReminders')
    .optional()
    .isBoolean()
    .withMessage('Workout reminders must be boolean'),
  body('preferences.notifications.mealReminders')
    .optional()
    .isBoolean()
    .withMessage('Meal reminders must be boolean'),
  body('preferences.notifications.progressUpdates')
    .optional()
    .isBoolean()
    .withMessage('Progress updates must be boolean'),
  body('preferences.privacy.profileVisibility')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Invalid profile visibility setting')
];

const deleteAccountValidation = [
  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required for account deletion')
];

// Routes
router.get('/dashboard', dashboardValidation, getDashboard);
router.get('/stats', statsValidation, getStats);
router.get('/progress', progressValidation, getProgress);
router.put('/preferences', preferencesValidation, updatePreferences);
router.delete('/delete-account', deleteAccountValidation, deleteAccount);

export default router;
