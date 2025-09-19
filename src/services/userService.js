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

export default new UserService();
