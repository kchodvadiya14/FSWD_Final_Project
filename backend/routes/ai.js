import express from 'express';
import { 
  aiChat, 
  generateMealPlan, 
  generateWorkoutPlan,
  moodBasedWorkout,
  generateProgressSummary 
} from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All AI routes require authentication
router.use(authenticate);

// AI Chat endpoint
router.post('/chat', aiChat);

// AI Meal Plan Generator
router.post('/meal-plan', generateMealPlan);

// AI Workout Plan Generator  
router.post('/workout-plan', generateWorkoutPlan);

// Mood-based Workout Recommender
router.post('/mood-workout', moodBasedWorkout);

// AI Progress Summary
router.post('/progress-summary', generateProgressSummary);

export default router;