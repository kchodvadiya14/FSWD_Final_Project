import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getNutritionEntries,
  getNutritionEntry,
  createOrUpdateNutritionEntry,
  addFoodItem,
  removeFoodItem,
  deleteNutritionEntry,
  getNutritionStats,
  searchFoods
} from '../controllers/nutritionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation rules
const foodItemValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Food name must be between 1 and 100 characters'),
  body('quantity.value')
    .isFloat({ min: 0.1 })
    .withMessage('Quantity must be at least 0.1'),
  body('quantity.unit')
    .isIn(['grams', 'kg', 'ml', 'liters', 'cups', 'pieces', 'tablespoons', 'teaspoons', 'ounces'])
    .withMessage('Invalid quantity unit'),
  body('nutrition.calories')
    .isFloat({ min: 0 })
    .withMessage('Calories must be a positive number'),
  body('nutrition.protein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Protein must be a positive number'),
  body('nutrition.carbs')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carbs must be a positive number'),
  body('nutrition.fats')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fats must be a positive number'),
  body('category')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack', 'drink', 'supplement'])
    .withMessage('Invalid food category')
];

const createNutritionValidation = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('meals.breakfast')
    .optional()
    .isArray()
    .withMessage('Breakfast must be an array of food items'),
  body('meals.lunch')
    .optional()
    .isArray()
    .withMessage('Lunch must be an array of food items'),
  body('meals.dinner')
    .optional()
    .isArray()
    .withMessage('Dinner must be an array of food items'),
  body('meals.snacks')
    .optional()
    .isArray()
    .withMessage('Snacks must be an array of food items'),
  body('water.intake')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Water intake must be a positive number'),
  body('water.unit')
    .optional()
    .isIn(['ml', 'liters', 'cups', 'ounces'])
    .withMessage('Invalid water unit'),
  body('water.target')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Water target must be a positive number'),
  body('targets.calories')
    .optional()
    .isFloat({ min: 500, max: 5000 })
    .withMessage('Calorie target must be between 500 and 5000'),
  body('targets.protein')
    .optional()
    .isFloat({ min: 10, max: 300 })
    .withMessage('Protein target must be between 10 and 300 grams'),
  body('targets.carbs')
    .optional()
    .isFloat({ min: 50, max: 800 })
    .withMessage('Carbs target must be between 50 and 800 grams'),
  body('targets.fats')
    .optional()
    .isFloat({ min: 20, max: 200 })
    .withMessage('Fats target must be between 20 and 200 grams'),
  body('mood.energy')
    .optional()
    .isIn(['very_low', 'low', 'moderate', 'high', 'very_high'])
    .withMessage('Invalid energy level'),
  body('mood.hunger')
    .optional()
    .isIn(['very_hungry', 'hungry', 'satisfied', 'full', 'very_full'])
    .withMessage('Invalid hunger level'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const addFoodItemValidation = [
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snacks'])
    .withMessage('Invalid meal type'),
  body('foodItem')
    .isObject()
    .withMessage('Food item must be an object'),
  ...foodItemValidation.map(validation => {
    // Modify the field path to include 'foodItem.' prefix
    const originalField = validation.builder.fields[0];
    validation.builder.fields = [`foodItem.${originalField}`];
    return validation;
  })
];

const removeFoodItemValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid nutrition entry ID'),
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snacks'])
    .withMessage('Invalid meal type'),
  body('foodItemIndex')
    .isInt({ min: 0 })
    .withMessage('Food item index must be a non-negative integer')
];

const getNutritionValidation = [
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
    .isIn(['date', 'dailyTotals.calories', 'dailyTotals.protein', 'dailyTotals.carbs', 'dailyTotals.fats', 'createdAt'])
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
    .withMessage('Date to must be a valid ISO 8601 date')
];

const nutritionStatsValidation = [
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

const searchFoodsValidation = [
  query('query')
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid nutrition entry ID')
];

// Routes
router.get('/', getNutritionValidation, getNutritionEntries);
router.get('/stats', nutritionStatsValidation, getNutritionStats);
router.get('/search-foods', searchFoodsValidation, searchFoods);
router.get('/:id', getNutritionEntry); // id can be ObjectId or date (YYYY-MM-DD)
router.post('/', createNutritionValidation, createOrUpdateNutritionEntry);
router.put('/:id', createNutritionValidation, createOrUpdateNutritionEntry);
router.post('/add-food', addFoodItemValidation, addFoodItem);
router.put('/:id/remove-food', removeFoodItemValidation, removeFoodItem);
router.delete('/:id', mongoIdValidation, deleteNutritionEntry);

export default router;
