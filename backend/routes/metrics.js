import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getHealthMetrics,
  getHealthMetric,
  createHealthMetric,
  updateHealthMetric,
  deleteHealthMetric,
  getHealthTrends,
  getLatestMetrics,
  getHealthSummary,
  addGoal,
  updateGoalStatus
} from '../controllers/metricsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation rules
const createMetricValidation = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('weight.value')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg'),
  body('weight.unit')
    .optional()
    .isIn(['kg', 'lbs'])
    .withMessage('Weight unit must be kg or lbs'),
  body('bodyFatPercentage')
    .optional()
    .isFloat({ min: 3, max: 60 })
    .withMessage('Body fat percentage must be between 3 and 60'),
  body('muscleMass.value')
    .optional()
    .isFloat({ min: 10, max: 200 })
    .withMessage('Muscle mass must be between 10 and 200'),
  body('boneDensity')
    .optional()
    .isFloat({ min: 0.5, max: 3.0 })
    .withMessage('Bone density must be between 0.5 and 3.0'),
  body('bodyWaterPercentage')
    .optional()
    .isFloat({ min: 30, max: 80 })
    .withMessage('Body water percentage must be between 30 and 80'),
  body('visceralFat')
    .optional()
    .isFloat({ min: 1, max: 30 })
    .withMessage('Visceral fat must be between 1 and 30'),
  body('bodyMeasurements.chest.value')
    .optional()
    .isFloat({ min: 50, max: 200 })
    .withMessage('Chest measurement must be between 50 and 200 cm'),
  body('bodyMeasurements.waist.value')
    .optional()
    .isFloat({ min: 40, max: 200 })
    .withMessage('Waist measurement must be between 40 and 200 cm'),
  body('bodyMeasurements.hips.value')
    .optional()
    .isFloat({ min: 40, max: 200 })
    .withMessage('Hips measurement must be between 40 and 200 cm'),
  body('vitalSigns.bloodPressure.systolic')
    .optional()
    .isInt({ min: 70, max: 250 })
    .withMessage('Systolic pressure must be between 70 and 250'),
  body('vitalSigns.bloodPressure.diastolic')
    .optional()
    .isInt({ min: 40, max: 150 })
    .withMessage('Diastolic pressure must be between 40 and 150'),
  body('vitalSigns.heartRate.resting')
    .optional()
    .isInt({ min: 30, max: 200 })
    .withMessage('Resting heart rate must be between 30 and 200'),
  body('sleepData.duration.hours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),
  body('sleepData.duration.minutes')
    .optional()
    .isInt({ min: 0, max: 59 })
    .withMessage('Sleep minutes must be between 0 and 59'),
  body('sleepData.quality')
    .optional()
    .isIn(['poor', 'fair', 'good', 'excellent'])
    .withMessage('Sleep quality must be poor, fair, good, or excellent'),
  body('sleepData.bedtime')
    .optional()
    .isISO8601()
    .withMessage('Bedtime must be a valid ISO 8601 date'),
  body('sleepData.wakeupTime')
    .optional()
    .isISO8601()
    .withMessage('Wakeup time must be a valid ISO 8601 date'),
  body('stressLevel')
    .optional()
    .isIn(['very_low', 'low', 'moderate', 'high', 'very_high'])
    .withMessage('Invalid stress level'),
  body('energyLevel')
    .optional()
    .isIn(['very_low', 'low', 'moderate', 'high', 'very_high'])
    .withMessage('Invalid energy level'),
  body('mood')
    .optional()
    .isIn(['very_poor', 'poor', 'neutral', 'good', 'excellent'])
    .withMessage('Invalid mood'),
  body('hydrationLevel')
    .optional()
    .isIn(['dehydrated', 'slightly_dehydrated', 'normal', 'well_hydrated'])
    .withMessage('Invalid hydration level'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const updateMetricValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid health metric ID'),
  ...createMetricValidation
];

const getMetricsValidation = [
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
    .isIn(['date', 'weight.value', 'bmi', 'bodyFatPercentage', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid ISO 8601 date'),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid ISO 8601 date'),
  query('metric')
    .optional()
    .isIn(['weight', 'bodyFat', 'sleep', 'vitals'])
    .withMessage('Invalid metric filter')
];

const trendsValidation = [
  query('metric')
    .optional()
    .isIn(['weight', 'bodyFat', 'sleep'])
    .withMessage('Invalid metric for trends'),
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

const summaryValidation = [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Invalid period for summary')
];

const goalValidation = [
  body('goal.type')
    .isIn(['weight_loss', 'weight_gain', 'muscle_gain', 'fat_loss', 'endurance', 'strength'])
    .withMessage('Invalid goal type'),
  body('goal.target')
    .isFloat({ min: 0.1 })
    .withMessage('Goal target must be a positive number'),
  body('goal.deadline')
    .isISO8601()
    .withMessage('Goal deadline must be a valid ISO 8601 date'),
  body('goal.notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Goal notes cannot exceed 500 characters')
];

const updateGoalValidation = [
  param('goalId')
    .isMongoId()
    .withMessage('Invalid goal ID'),
  body('achieved')
    .optional()
    .isBoolean()
    .withMessage('Achieved must be a boolean'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid health metric ID')
];

// Routes
router.get('/', getMetricsValidation, getHealthMetrics);
router.get('/latest', getLatestMetrics);
router.get('/trends', trendsValidation, getHealthTrends);
router.get('/summary', summaryValidation, getHealthSummary);
router.get('/:id', mongoIdValidation, getHealthMetric);
router.post('/', createMetricValidation, createHealthMetric);
router.put('/:id', updateMetricValidation, updateHealthMetric);
router.delete('/:id', mongoIdValidation, deleteHealthMetric);
router.post('/goals', goalValidation, addGoal);
router.put('/goals/:goalId', updateGoalValidation, updateGoalStatus);

export default router;
