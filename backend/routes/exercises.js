import express from 'express';
import {
  getExercises,
  getExercise,
  getCategories,
  createExercise,
  seedExercises
} from '../controllers/exerciseController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes (exercises are generally public)
router.get('/', getExercises);
router.get('/categories', getCategories);
router.get('/seed', seedExercises); // For initial setup
router.get('/:id', getExercise);

// Protected routes (admin only for creating exercises)
router.post('/', authenticate, createExercise);

export default router;