import api from './api';

class WorkoutService {
  // Get all workouts
  async getWorkouts(params = {}) {
    try {
      const response = await api.get('/workouts', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Get single workout
  async getWorkout(id) {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data.data.workout;
    } catch (error) {
      throw error;
    }
  }

  // Create new workout
  async createWorkout(workoutData) {
    try {
      const response = await api.post('/workouts', workoutData);
      return response.data.data.workout;
    } catch (error) {
      throw error;
    }
  }

  // Update workout
  async updateWorkout(id, workoutData) {
    try {
      const response = await api.put(`/workouts/${id}`, workoutData);
      return response.data.data.workout;
    } catch (error) {
      throw error;
    }
  }

  // Delete workout
  async deleteWorkout(id) {
    try {
      const response = await api.delete(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get workout statistics
  async getWorkoutStats(params = {}) {
    try {
      const response = await api.get('/workouts/stats', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Duplicate workout
  async duplicateWorkout(id, data = {}) {
    try {
      const response = await api.post(`/workouts/${id}/duplicate`, data);
      return response.data.data.workout;
    } catch (error) {
      throw error;
    }
  }

  // Get workout templates
  async getWorkoutTemplates(params = {}) {
    try {
      const response = await api.get('/workouts/templates', { params });
      return response.data.data.templates;
    } catch (error) {
      throw error;
    }
  }
}

export default new WorkoutService();
