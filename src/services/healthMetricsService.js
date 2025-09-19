import api from './api';

class HealthMetricsService {
  // Get all health metrics
  async getHealthMetrics(params = {}) {
    try {
      const response = await api.get('/metrics', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Get single health metric
  async getHealthMetric(id) {
    try {
      const response = await api.get(`/metrics/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Create health metric
  async createHealthMetric(metricData) {
    try {
      const response = await api.post('/metrics', metricData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Update health metric
  async updateHealthMetric(id, metricData) {
    try {
      const response = await api.put(`/metrics/${id}`, metricData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete health metric
  async deleteHealthMetric(id) {
    try {
      const response = await api.delete(`/metrics/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get latest metrics
  async getLatestMetrics() {
    try {
      const response = await api.get('/metrics/latest');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Get health trends
  async getHealthTrends(params = {}) {
    try {
      const response = await api.get('/metrics/trends', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Get health summary
  async getHealthSummary(params = {}) {
    try {
      const response = await api.get('/metrics/summary', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Add goal
  async addGoal(goalData) {
    try {
      const response = await api.post('/metrics/goals', goalData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Update goal status
  async updateGoalStatus(goalId, statusData) {
    try {
      const response = await api.put(`/metrics/goals/${goalId}`, statusData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new HealthMetricsService();
