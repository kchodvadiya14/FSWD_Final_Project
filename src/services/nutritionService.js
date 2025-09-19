import api from './api';

class NutritionService {
  // Get all nutrition entries
  async getNutritionEntries(params = {}) {
    try {
      const response = await api.get('/nutrition', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Get nutrition entry by ID or date
  async getNutritionEntry(id) {
    try {
      const response = await api.get(`/nutrition/${id}`);
      return response.data.data.nutritionEntry;
    } catch (error) {
      throw error;
    }
  }

  // Create or update nutrition entry
  async createOrUpdateNutritionEntry(nutritionData) {
    try {
      const response = await api.post('/nutrition', nutritionData);
      return response.data.data.nutritionEntry;
    } catch (error) {
      throw error;
    }
  }

  // Add food item to meal
  async addFoodItem(foodData) {
    try {
      const response = await api.post('/nutrition/add-food', foodData);
      return response.data.data.nutritionEntry;
    } catch (error) {
      throw error;
    }
  }

  // Remove food item from meal
  async removeFoodItem(id, removeData) {
    try {
      const response = await api.put(`/nutrition/${id}/remove-food`, removeData);
      return response.data.data.nutritionEntry;
    } catch (error) {
      throw error;
    }
  }

  // Delete nutrition entry
  async deleteNutritionEntry(id) {
    try {
      const response = await api.delete(`/nutrition/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get nutrition statistics
  async getNutritionStats(params = {}) {
    try {
      const response = await api.get('/nutrition/stats', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Search foods
  async searchFoods(query, limit = 10) {
    try {
      const response = await api.get('/nutrition/search-foods', {
        params: { query, limit }
      });
      return response.data.data.results;
    } catch (error) {
      throw error;
    }
  }
}

export default new NutritionService();
