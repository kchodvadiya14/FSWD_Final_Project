import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Get all workouts for user
export const getWorkouts = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'date', 
      sortOrder = 'desc',
      workoutType,
      dateFrom,
      dateTo,
      search
    } = req.query;

    // Build query
    const query = { userId };

    // Filter by workout type
    if (workoutType && workoutType !== 'all') {
      query.workoutType = workoutType;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // Search in title, description, or exercise names
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'exercises.name': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const [workouts, total] = await Promise.all([
      Workout.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Workout.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: 'Workouts retrieved successfully',
      data: {
        workouts,
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
    console.error('Get workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve workouts',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get single workout by ID
export const getWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const workout = await Workout.findOne({ _id: id, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Workout retrieved successfully',
      data: { workout }
    });

  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve workout',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Create new workout
export const createWorkout = async (req, res) => {
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
    const workoutData = { ...req.body, userId };

    // Get user data for calorie calculation
    const user = await User.findById(userId);
    const userWeight = user?.profile?.currentWeight?.value || 70; // Default to 70kg

    const workout = new Workout(workoutData);

    // Calculate estimated calories if not provided
    if (!workout.totalCaloriesBurned || workout.totalCaloriesBurned === 0) {
      workout.totalCaloriesBurned = workout.calculateEstimatedCalories(userWeight);
    }

    await workout.save();

    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      data: { workout }
    });

  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create workout',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update existing workout
export const updateWorkout = async (req, res) => {
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

    const workout = await Workout.findOne({ _id: id, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Update workout fields
    Object.keys(updates).forEach(key => {
      workout[key] = updates[key];
    });

    // Recalculate calories if exercises were updated
    if (updates.exercises) {
      const user = await User.findById(userId);
      const userWeight = user?.profile?.currentWeight?.value || 70;
      workout.totalCaloriesBurned = workout.calculateEstimatedCalories(userWeight);
    }

    await workout.save();

    res.status(200).json({
      success: true,
      message: 'Workout updated successfully',
      data: { workout }
    });

  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update workout',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete workout
export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const workout = await Workout.findOneAndDelete({ _id: id, userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully'
    });

  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete workout',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get workout statistics
export const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate = new Date(),
      groupBy = 'week' // day, week, month
    } = req.query;

    const dateRange = {
      start: new Date(startDate),
      end: new Date(endDate)
    };

    // Get overall stats
    const overallStats = await Workout.getWorkoutStats(userId, dateRange);

    // Get grouped stats for charts
    let groupStage;
    switch (groupBy) {
      case 'day':
        groupStage = {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          }
        };
        break;
      case 'week':
        groupStage = {
          _id: {
            year: { $year: '$date' },
            week: { $week: '$date' }
          }
        };
        break;
      case 'month':
        groupStage = {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          }
        };
        break;
      default:
        groupStage = {
          _id: {
            year: { $year: '$date' },
            week: { $week: '$date' }
          }
        };
    }

    const groupedStats = await Workout.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $group: {
          ...groupStage,
          totalWorkouts: { $sum: 1 },
          totalCalories: { $sum: '$totalCaloriesBurned' },
          totalDuration: { $sum: '$durationInMinutes' },
          workoutTypes: { $push: '$workoutType' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.week': 1,
          '_id.day': 1
        }
      }
    ]);

    // Get exercise frequency
    const exerciseStats = await Workout.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      { $unwind: '$exercises' },
      {
        $group: {
          _id: '$exercises.name',
          count: { $sum: 1 },
          totalCalories: { $sum: '$exercises.caloriesBurned' },
          totalDuration: { $sum: '$exercises.duration.value' },
          category: { $first: '$exercises.category' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      message: 'Workout statistics retrieved successfully',
      data: {
        dateRange,
        groupBy,
        overallStats: overallStats[0] || {},
        groupedStats,
        exerciseStats
      }
    });

  } catch (error) {
    console.error('Get workout stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve workout statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Duplicate workout
export const duplicateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { date, title } = req.body;

    const originalWorkout = await Workout.findOne({ _id: id, userId });

    if (!originalWorkout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Create duplicate workout
    const duplicateData = originalWorkout.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;

    // Update with new data
    duplicateData.title = title || `${duplicateData.title} (Copy)`;
    duplicateData.date = date || new Date();

    const duplicateWorkout = new Workout(duplicateData);
    await duplicateWorkout.save();

    res.status(201).json({
      success: true,
      message: 'Workout duplicated successfully',
      data: { workout: duplicateWorkout }
    });

  } catch (error) {
    console.error('Duplicate workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate workout',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get workout templates (popular workouts)
export const getWorkoutTemplates = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;

    // Build query for popular workouts
    const matchStage = { isPublic: true };
    if (category && category !== 'all') {
      matchStage.workoutType = category;
    }

    const templates = await Workout.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            title: '$title',
            workoutType: '$workoutType',
            exercises: '$exercises'
          },
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          avgDuration: { $avg: '$durationInMinutes' },
          avgCalories: { $avg: '$totalCaloriesBurned' }
        }
      },
      { $sort: { count: -1, avgRating: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          title: '$_id.title',
          workoutType: '$_id.workoutType',
          exercises: '$_id.exercises',
          popularity: '$count',
          avgRating: { $round: ['$avgRating', 1] },
          avgDuration: { $round: ['$avgDuration', 0] },
          avgCalories: { $round: ['$avgCalories', 0] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Workout templates retrieved successfully',
      data: { templates }
    });

  } catch (error) {
    console.error('Get workout templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve workout templates',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
