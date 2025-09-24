import api from './api';

class UserService {
  // Get dashboard data
  async getDashboard(params = {}) {
    try {
      const response = await api.get('/users/dashboard', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  async getStats(params = {}) {
    try {
      const response = await api.get('/users/stats', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user progress
  async getProgress(params = {}) {
    try {
      const response = await api.get('/users/progress', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const response = await api.put('/users/preferences', { preferences });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete user account
  async deleteAccount(confirmPassword) {
    try {
      const response = await api.delete('/users/delete-account', {
        data: { confirmPassword }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

class NutritionService {
  // Get nutrition entries
  async getNutritionEntries(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/nutrition${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get single nutrition entry
  async getNutritionEntry(id) {
    try {
      const response = await api.get(`/nutrition/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Create nutrition entry
  async createNutritionEntry(nutritionData) {
    try {
      const response = await api.post('/nutrition', nutritionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update nutrition entry
  async updateNutritionEntry(id, nutritionData) {
    try {
      const response = await api.put(`/nutrition/${id}`, nutritionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete nutrition entry
  async deleteNutritionEntry(id) {
    try {
      const response = await api.delete(`/nutrition/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get nutrition statistics
  async getNutritionStats(date) {
    try {
      const response = await api.get(`/nutrition/stats${date ? `?date=${date}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export const nutritionService = new NutritionService();
export default new UserService();
