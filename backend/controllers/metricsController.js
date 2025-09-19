import HealthMetrics from '../models/HealthMetrics.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Get all health metrics for user
export const getHealthMetrics = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'date', 
      sortOrder = 'desc',
      dateFrom,
      dateTo,
      metric
    } = req.query;

    // Build query
    const query = { userId };

    // Filter by date range
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // Filter by specific metric existence
    if (metric) {
      switch (metric) {
        case 'weight':
          query['weight.value'] = { $exists: true };
          break;
        case 'bodyFat':
          query.bodyFatPercentage = { $exists: true };
          break;
        case 'sleep':
          query['sleepData.duration'] = { $exists: true };
          break;
        case 'vitals':
          query.vitalSigns = { $exists: true };
          break;
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const [metrics, total] = await Promise.all([
      HealthMetrics.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      HealthMetrics.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: 'Health metrics retrieved successfully',
      data: {
        metrics,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Get health metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get single health metric entry by ID
export const getHealthMetric = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const metric = await HealthMetrics.findOne({ _id: id, userId });

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    // Get comparison with previous entry
    const comparison = await metric.compareWithPrevious();

    res.status(200).json({
      success: true,
      message: 'Health metric retrieved successfully',
      data: { 
        metric,
        comparison
      }
    });

  } catch (error) {
    console.error('Get health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health metric',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Create new health metric entry
export const createHealthMetric = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.userId;
    const metricData = { ...req.body, userId };

    const metric = new HealthMetrics(metricData);
    await metric.save();

    // Get comparison with previous entry
    const comparison = await metric.compareWithPrevious();

    res.status(201).json({
      success: true,
      message: 'Health metric created successfully',
      data: { 
        metric,
        comparison
      }
    });

  } catch (error) {
    console.error('Create health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create health metric',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update existing health metric
export const updateHealthMetric = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.userId;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.userId;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const metric = await HealthMetrics.findOne({ _id: id, userId });

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    // Update metric fields
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
        // Merge nested objects
        metric[key] = { ...metric[key], ...updates[key] };
      } else {
        metric[key] = updates[key];
      }
    });

    await metric.save();

    // Get comparison with previous entry
    const comparison = await metric.compareWithPrevious();

    res.status(200).json({
      success: true,
      message: 'Health metric updated successfully',
      data: { 
        metric,
        comparison
      }
    });

  } catch (error) {
    console.error('Update health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update health metric',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete health metric
export const deleteHealthMetric = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const metric = await HealthMetrics.findOneAndDelete({ _id: id, userId });

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Health metric deleted successfully'
    });

  } catch (error) {
    console.error('Delete health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete health metric',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get health trends
export const getHealthTrends = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      metric = 'weight',
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      endDate = new Date(),
      groupBy = 'week'
    } = req.query;

    const dateRange = {
      start: new Date(startDate),
      end: new Date(endDate)
    };

    // Get trend data for specific metric
    const trendData = await HealthMetrics.getHealthTrends(userId, dateRange, metric);

    // Calculate trend statistics
    let trendStats = {};
    if (trendData.length > 1) {
      const values = trendData.map(entry => entry.value).filter(v => v != null);
      if (values.length > 1) {
        const firstValue = values[0];
        const lastValue = values[values.length - 1];
        const change = lastValue - firstValue;
        const percentageChange = ((change / firstValue) * 100);

        trendStats = {
          totalChange: Math.round(change * 100) / 100,
          percentageChange: Math.round(percentageChange * 100) / 100,
          trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
          dataPoints: values.length,
          minValue: Math.min(...values),
          maxValue: Math.max(...values),
          avgValue: Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 100) / 100
        };
      }
    }

    res.status(200).json({
      success: true,
      message: 'Health trends retrieved successfully',
      data: {
        metric,
        dateRange,
        trendData,
        trendStats
      }
    });

  } catch (error) {
    console.error('Get health trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health trends',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get latest metrics
export const getLatestMetrics = async (req, res) => {
  try {
    const userId = req.userId;

    const latestMetrics = await HealthMetrics.getLatestMetrics(userId);

    if (!latestMetrics) {
      return res.status(404).json({
        success: false,
        message: 'No health metrics found'
      });
    }

    // Get goal progress
    const goalProgress = await HealthMetrics.calculateGoalProgress(userId);

    // Get comparison with previous entry
    const comparison = await latestMetrics.compareWithPrevious();

    res.status(200).json({
      success: true,
      message: 'Latest metrics retrieved successfully',
      data: {
        metrics: latestMetrics,
        goalProgress,
        comparison
      }
    });

  } catch (error) {
    console.error('Get latest metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get health summary/overview
export const getHealthSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = '30d' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const dateRange = { start: startDate, end: now };

    // Get comprehensive health data
    const [
      latestMetrics,
      totalEntries,
      weightTrend,
      sleepAverage,
      goalProgress
    ] = await Promise.all([
      HealthMetrics.getLatestMetrics(userId),
      HealthMetrics.countDocuments({ 
        userId, 
        createdAt: { $gte: startDate, $lte: now } 
      }),
      HealthMetrics.getHealthTrends(userId, dateRange, 'weight'),
      HealthMetrics.aggregate([
        {
          $match: {
            userId: userId,
            date: { $gte: startDate, $lte: now },
            'sleepData.duration.hours': { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            avgSleepHours: { $avg: '$sleepData.duration.hours' },
            avgSleepMinutes: { $avg: '$sleepData.duration.minutes' },
            totalEntries: { $sum: 1 }
          }
        }
      ]),
      HealthMetrics.calculateGoalProgress(userId)
    ]);

    // Calculate health score (simplified algorithm)
    let healthScore = 0;
    let scoreFactors = [];

    if (latestMetrics) {
      // BMI factor (0-25 points)
      if (latestMetrics.bmi) {
        const bmi = latestMetrics.bmi;
        if (bmi >= 18.5 && bmi <= 24.9) {
          healthScore += 25;
          scoreFactors.push({ factor: 'BMI', score: 25, status: 'excellent' });
        } else if ((bmi >= 17 && bmi < 18.5) || (bmi >= 25 && bmi <= 29.9)) {
          healthScore += 15;
          scoreFactors.push({ factor: 'BMI', score: 15, status: 'good' });
        } else {
          healthScore += 5;
          scoreFactors.push({ factor: 'BMI', score: 5, status: 'needs_improvement' });
        }
      }

      // Sleep factor (0-25 points)
      if (sleepAverage.length > 0) {
        const avgSleep = sleepAverage[0].avgSleepHours + (sleepAverage[0].avgSleepMinutes / 60);
        if (avgSleep >= 7 && avgSleep <= 9) {
          healthScore += 25;
          scoreFactors.push({ factor: 'Sleep', score: 25, status: 'excellent' });
        } else if (avgSleep >= 6 && avgSleep < 10) {
          healthScore += 15;
          scoreFactors.push({ factor: 'Sleep', score: 15, status: 'good' });
        } else {
          healthScore += 5;
          scoreFactors.push({ factor: 'Sleep', score: 5, status: 'needs_improvement' });
        }
      }

      // Body fat factor (0-25 points)
      if (latestMetrics.bodyFatPercentage) {
        const bodyFat = latestMetrics.bodyFatPercentage;
        if (bodyFat >= 10 && bodyFat <= 20) {
          healthScore += 25;
          scoreFactors.push({ factor: 'Body Fat', score: 25, status: 'excellent' });
        } else if (bodyFat >= 8 && bodyFat <= 25) {
          healthScore += 15;
          scoreFactors.push({ factor: 'Body Fat', score: 15, status: 'good' });
        } else {
          healthScore += 5;
          scoreFactors.push({ factor: 'Body Fat', score: 5, status: 'needs_improvement' });
        }
      }

      // Consistency factor (0-25 points)
      const consistencyScore = Math.min(25, (totalEntries / (period === '7d' ? 7 : period === '30d' ? 30 : 90)) * 25);
      healthScore += consistencyScore;
      scoreFactors.push({ 
        factor: 'Consistency', 
        score: Math.round(consistencyScore), 
        status: consistencyScore > 20 ? 'excellent' : consistencyScore > 10 ? 'good' : 'needs_improvement' 
      });
    }

    const healthScorePercentage = Math.round((healthScore / 100) * 100);

    res.status(200).json({
      success: true,
      message: 'Health summary retrieved successfully',
      data: {
        period,
        dateRange,
        latestMetrics,
        totalEntries,
        weightTrend: weightTrend.slice(-10), // Last 10 entries
        sleepAverage: sleepAverage[0] || null,
        goalProgress,
        healthScore: {
          percentage: healthScorePercentage,
          grade: healthScorePercentage >= 90 ? 'A' : 
                 healthScorePercentage >= 80 ? 'B' : 
                 healthScorePercentage >= 70 ? 'C' : 
                 healthScorePercentage >= 60 ? 'D' : 'F',
          factors: scoreFactors
        }
      }
    });

  } catch (error) {
    console.error('Get health summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health summary',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Add or update goal
export const addGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.userId;
    const { goal } = req.body;

    // Get latest metrics or create new entry
    let metrics = await HealthMetrics.getLatestMetrics(userId);
    
    if (!metrics) {
      // Create new metrics entry with just the goal
      metrics = new HealthMetrics({
        userId,
        date: new Date(),
        goals: [goal]
      });
    } else {
      // Add goal to existing metrics
      metrics.goals.push(goal);
    }

    await metrics.save();

    res.status(200).json({
      success: true,
      message: 'Goal added successfully',
      data: { goal, totalGoals: metrics.goals.length }
    });

  } catch (error) {
    console.error('Add goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add goal',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update goal status
export const updateGoalStatus = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { achieved, notes } = req.body;
    const userId = req.userId;

    const metrics = await HealthMetrics.findOne({
      userId,
      'goals._id': goalId
    });

    if (!metrics) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Update the specific goal
    const goal = metrics.goals.id(goalId);
    if (achieved !== undefined) goal.achieved = achieved;
    if (notes !== undefined) goal.notes = notes;

    await metrics.save();

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: { goal }
    });

  } catch (error) {
    console.error('Update goal status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update goal',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
