import api from './api.js';

class WorkoutService {
  // Get all workouts
  async getWorkouts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/workouts${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get single workout
  async getWorkout(id) {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Create workout
  async createWorkout(workoutData) {
    try {
      const response = await api.post('/workouts', workoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update workout
  async updateWorkout(id, workoutData) {
    try {
      const response = await api.put(`/workouts/${id}`, workoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete workout
  async deleteWorkout(id) {
    try {
      const response = await api.delete(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get workout statistics
  async getWorkoutStats(period = '30') {
    try {
      const response = await api.get(`/workouts/stats?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

class ExerciseService {
  // Get all exercises
  async getExercises(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/exercises${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get single exercise
  async getExercise(id) {
    try {
      const response = await api.get(`/exercises/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get exercise categories
  async getCategories() {
    try {
      const response = await api.get('/exercises/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Seed exercise library
  async seedExercises() {
    try {
      const response = await api.get('/exercises/seed');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

class GoalService {
  // Get all goals
  async getGoals(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/goals${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get single goal
  async getGoal(id) {
    try {
      const response = await api.get(`/goals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Create goal
  async createGoal(goalData) {
    try {
      const response = await api.post('/goals', goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update goal
  async updateGoal(id, goalData) {
    try {
      const response = await api.put(`/goals/${id}`, goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update goal progress
  async updateGoalProgress(id, progressData) {
    try {
      const response = await api.put(`/goals/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete goal
  async deleteGoal(id) {
    try {
      const response = await api.delete(`/goals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get goal statistics
  async getGoalStats() {
    try {
      const response = await api.get('/goals/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export const workoutService = new WorkoutService();
export const exerciseService = new ExerciseService();
export const goalService = new GoalService();