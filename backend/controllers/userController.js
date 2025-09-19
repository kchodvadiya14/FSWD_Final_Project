import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import HealthMetrics from '../models/HealthMetrics.js';
import { validationResult } from 'express-validator';

// Get user dashboard data
export const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const { timeRange = '7d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
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
        startDate.setDate(now.getDate() - 7);
    }

    // Get user profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent data in parallel
    const [
      workoutStats,
      nutritionStats,
      latestMetrics,
      recentWorkouts,
      recentNutrition
    ] = await Promise.all([
      Workout.getWorkoutStats(userId, { start: startDate, end: now }),
      Nutrition.getNutritionStats(userId, { start: startDate, end: now }),
      HealthMetrics.getLatestMetrics(userId),
      Workout.find({ userId })
        .sort({ date: -1 })
        .limit(5)
        .select('title date totalCaloriesBurned workoutType totalDuration'),
      Nutrition.find({ userId })
        .sort({ date: -1 })
        .limit(5)
        .select('date dailyTotals.calories dailyTotals.protein dailyTotals.carbs dailyTotals.fats')
    ]);

    // Calculate goal progress
    const goalProgress = await HealthMetrics.calculateGoalProgress(userId);

    // Get today's data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayWorkouts, todayNutrition] = await Promise.all([
      Workout.find({
        userId,
        date: { $gte: today, $lt: tomorrow }
      }),
      Nutrition.findOne({
        userId,
        date: { $gte: today, $lt: tomorrow }
      })
    ]);

    // Calculate today's totals
    const todayTotals = {
      caloriesBurned: todayWorkouts.reduce((sum, workout) => sum + (workout.totalCaloriesBurned || 0), 0),
      caloriesConsumed: todayNutrition?.dailyTotals?.calories || 0,
      workouts: todayWorkouts.length,
      protein: todayNutrition?.dailyTotals?.protein || 0,
      carbs: todayNutrition?.dailyTotals?.carbs || 0,
      fats: todayNutrition?.dailyTotals?.fats || 0,
      water: todayNutrition?.water?.intake || 0
    };

    // Calculate calorie balance
    const calorieBalance = {
      consumed: todayTotals.caloriesConsumed,
      burned: todayTotals.caloriesBurned,
      net: todayTotals.caloriesConsumed - todayTotals.caloriesBurned,
      target: user.dailyCalorieTarget,
      remaining: Math.max(0, user.dailyCalorieTarget - (todayTotals.caloriesConsumed - todayTotals.caloriesBurned))
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        user: {
          name: user.name,
          profile: user.profile,
          bmi: user.bmi,
          dailyCalorieTarget: user.dailyCalorieTarget
        },
        timeRange,
        todayTotals,
        calorieBalance,
        workoutStats: workoutStats[0] || {
          totalWorkouts: 0,
          totalCaloriesBurned: 0,
          totalDuration: 0,
          avgCaloriesPerWorkout: 0,
          avgDurationPerWorkout: 0,
          workoutTypeDistribution: {}
        },
        nutritionStats: nutritionStats[0] || {
          totalDays: 0,
          avgCalories: 0,
          avgProtein: 0,
          avgCarbs: 0,
          avgFats: 0,
          avgWaterIntake: 0
        },
        latestMetrics,
        goalProgress,
        recentActivity: {
          workouts: recentWorkouts,
          nutrition: recentNutrition
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get user statistics
export const getStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate = new Date() 
    } = req.query;

    const dateRange = {
      start: new Date(startDate),
      end: new Date(endDate)
    };

    // Get comprehensive statistics
    const [
      workoutStats,
      nutritionStats,
      healthTrends,
      totalEntries
    ] = await Promise.all([
      Workout.getWorkoutStats(userId, dateRange),
      Nutrition.getNutritionStats(userId, dateRange),
      HealthMetrics.getHealthTrends(userId, dateRange),
      Promise.all([
        Workout.countDocuments({ userId, createdAt: { $gte: dateRange.start, $lte: dateRange.end } }),
        Nutrition.countDocuments({ userId, createdAt: { $gte: dateRange.start, $lte: dateRange.end } }),
        HealthMetrics.countDocuments({ userId, createdAt: { $gte: dateRange.start, $lte: dateRange.end } })
      ])
    ]);

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        dateRange,
        workoutStats: workoutStats[0] || {},
        nutritionStats: nutritionStats[0] || {},
        healthTrends,
        totalEntries: {
          workouts: totalEntries[0],
          nutrition: totalEntries[1],
          healthMetrics: totalEntries[2]
        }
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get user progress over time
export const getProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      metric = 'weight',
      period = '3m' // 3 months default
    } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 3);
    }

    const dateRange = { start: startDate, end: now };

    let progressData = [];

    switch (metric) {
      case 'weight':
      case 'bodyFat':
      case 'sleep':
        progressData = await HealthMetrics.getHealthTrends(userId, dateRange, metric);
        break;
      
      case 'workouts':
        // Get workout frequency over time
        progressData = await Workout.aggregate([
          {
            $match: {
              userId: userId,
              date: { $gte: startDate, $lte: now }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$date' },
                month: { $month: '$date' },
                week: { $week: '$date' }
              },
              count: { $sum: 1 },
              totalCalories: { $sum: '$totalCaloriesBurned' }
            }
          },
          {
            $sort: {
              '_id.year': 1,
              '_id.month': 1,
              '_id.week': 1
            }
          }
        ]);
        break;

      case 'nutrition':
        // Get nutrition trends over time
        progressData = await Nutrition.aggregate([
          {
            $match: {
              userId: userId,
              date: { $gte: startDate, $lte: now }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$date' },
                month: { $month: '$date' },
                week: { $week: '$date' }
              },
              avgCalories: { $avg: '$dailyTotals.calories' },
              avgProtein: { $avg: '$dailyTotals.protein' },
              avgCarbs: { $avg: '$dailyTotals.carbs' },
              avgFats: { $avg: '$dailyTotals.fats' }
            }
          },
          {
            $sort: {
              '_id.year': 1,
              '_id.month': 1,
              '_id.week': 1
            }
          }
        ]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid metric specified'
        });
    }

    res.status(200).json({
      success: true,
      message: 'Progress data retrieved successfully',
      data: {
        metric,
        period,
        dateRange,
        progressData
      }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve progress data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
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
    const { preferences } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete user account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { confirmPassword } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password for account deletion
    const isPasswordValid = await user.comparePassword(confirmPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password confirmation failed'
      });
    }

    // Delete all user data
    await Promise.all([
      Workout.deleteMany({ userId }),
      Nutrition.deleteMany({ userId }),
      HealthMetrics.deleteMany({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.status(200).json({
      success: true,
      message: 'Account and all data deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
