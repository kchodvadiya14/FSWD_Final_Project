import Nutrition from '../models/Nutrition.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Get all nutrition entries for user
export const getNutritionEntries = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'date', 
      sortOrder = 'desc',
      dateFrom,
      dateTo,
      search
    } = req.query;

    // Build query
    const query = { userId };

    // Filter by date range
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // Search in food items
    if (search) {
      query.$or = [
        { 'meals.breakfast.name': { $regex: search, $options: 'i' } },
        { 'meals.lunch.name': { $regex: search, $options: 'i' } },
        { 'meals.dinner.name': { $regex: search, $options: 'i' } },
        { 'meals.snacks.name': { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const [nutritionEntries, total] = await Promise.all([
      Nutrition.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Nutrition.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: 'Nutrition entries retrieved successfully',
      data: {
        nutritionEntries,
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
    console.error('Get nutrition entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve nutrition entries',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get single nutrition entry by ID or date
export const getNutritionEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    let nutritionEntry;

    // Check if id is a valid date (YYYY-MM-DD format)
    if (id.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(id);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      nutritionEntry = await Nutrition.findOne({
        userId,
        date: { $gte: date, $lt: nextDay }
      });
    } else {
      // Assume it's a MongoDB ObjectId
      nutritionEntry = await Nutrition.findOne({ _id: id, userId });
    }

    if (!nutritionEntry) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Nutrition entry retrieved successfully',
      data: { nutritionEntry }
    });

  } catch (error) {
    console.error('Get nutrition entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve nutrition entry',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Create or update nutrition entry for a specific date
export const createOrUpdateNutritionEntry = async (req, res) => {
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
    const { date = new Date(), ...nutritionData } = req.body;

    // Set user targets if not provided
    const user = await User.findById(userId);
    if (!nutritionData.targets && user) {
      nutritionData.targets = {
        calories: user.dailyCalorieTarget || 2000,
        protein: Math.round((user.dailyCalorieTarget || 2000) * 0.15 / 4), // 15% of calories from protein
        carbs: Math.round((user.dailyCalorieTarget || 2000) * 0.50 / 4), // 50% of calories from carbs
        fats: Math.round((user.dailyCalorieTarget || 2000) * 0.35 / 9), // 35% of calories from fats
        fiber: 25,
        sugar: 50,
        sodium: 2300
      };
    }

    // Check if entry for this date already exists
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(entryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let nutritionEntry = await Nutrition.findOne({
      userId,
      date: { $gte: entryDate, $lt: nextDay }
    });

    if (nutritionEntry) {
      // Update existing entry
      Object.keys(nutritionData).forEach(key => {
        if (key === 'meals') {
          // Merge meals data
          Object.keys(nutritionData.meals).forEach(mealType => {
            if (nutritionData.meals[mealType]) {
              nutritionEntry.meals[mealType] = nutritionData.meals[mealType];
            }
          });
        } else {
          nutritionEntry[key] = nutritionData[key];
        }
      });

      await nutritionEntry.save();

      res.status(200).json({
        success: true,
        message: 'Nutrition entry updated successfully',
        data: { nutritionEntry }
      });
    } else {
      // Create new entry
      nutritionEntry = new Nutrition({
        userId,
        date: entryDate,
        ...nutritionData
      });

      await nutritionEntry.save();

      res.status(201).json({
        success: true,
        message: 'Nutrition entry created successfully',
        data: { nutritionEntry }
      });
    }

  } catch (error) {
    console.error('Create/update nutrition entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create/update nutrition entry',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Add food item to a specific meal
export const addFoodItem = async (req, res) => {
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
    const { date, mealType, foodItem } = req.body;

    // Validate meal type
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal type'
      });
    }

    // Find or create nutrition entry for the date
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(entryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let nutritionEntry = await Nutrition.findOne({
      userId,
      date: { $gte: entryDate, $lt: nextDay }
    });

    if (!nutritionEntry) {
      // Create new entry if it doesn't exist
      const user = await User.findById(userId);
      nutritionEntry = new Nutrition({
        userId,
        date: entryDate,
        targets: {
          calories: user?.dailyCalorieTarget || 2000,
          protein: Math.round((user?.dailyCalorieTarget || 2000) * 0.15 / 4),
          carbs: Math.round((user?.dailyCalorieTarget || 2000) * 0.50 / 4),
          fats: Math.round((user?.dailyCalorieTarget || 2000) * 0.35 / 9),
          fiber: 25,
          sugar: 50,
          sodium: 2300
        },
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        }
      });
    }

    // Add food item to the specified meal
    nutritionEntry.meals[mealType].push(foodItem);
    await nutritionEntry.save();

    res.status(200).json({
      success: true,
      message: 'Food item added successfully',
      data: { nutritionEntry }
    });

  } catch (error) {
    console.error('Add food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add food item',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Remove food item from a meal
export const removeFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { mealType, foodItemIndex } = req.body;
    const userId = req.userId;

    const nutritionEntry = await Nutrition.findOne({ _id: id, userId });

    if (!nutritionEntry) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition entry not found'
      });
    }

    // Validate meal type and food item index
    if (!nutritionEntry.meals[mealType] || !nutritionEntry.meals[mealType][foodItemIndex]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal type or food item index'
      });
    }

    // Remove food item
    nutritionEntry.meals[mealType].splice(foodItemIndex, 1);
    await nutritionEntry.save();

    res.status(200).json({
      success: true,
      message: 'Food item removed successfully',
      data: { nutritionEntry }
    });

  } catch (error) {
    console.error('Remove food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove food item',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete nutrition entry
export const deleteNutritionEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const nutritionEntry = await Nutrition.findOneAndDelete({ _id: id, userId });

    if (!nutritionEntry) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Nutrition entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete nutrition entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete nutrition entry',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get nutrition statistics
export const getNutritionStats = async (req, res) => {
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
    const overallStats = await Nutrition.getNutritionStats(userId, dateRange);

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

    const groupedStats = await Nutrition.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $group: {
          ...groupStage,
          avgCalories: { $avg: '$dailyTotals.calories' },
          avgProtein: { $avg: '$dailyTotals.protein' },
          avgCarbs: { $avg: '$dailyTotals.carbs' },
          avgFats: { $avg: '$dailyTotals.fats' },
          avgFiber: { $avg: '$dailyTotals.fiber' },
          avgWater: { $avg: '$water.intake' },
          totalDays: { $sum: 1 }
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

    // Get most consumed foods
    const topFoods = await Nutrition.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $project: {
          allFoods: {
            $concatArrays: [
              '$meals.breakfast',
              '$meals.lunch',
              '$meals.dinner',
              '$meals.snacks'
            ]
          }
        }
      },
      { $unwind: '$allFoods' },
      {
        $group: {
          _id: '$allFoods.name',
          count: { $sum: 1 },
          totalCalories: { $sum: '$allFoods.nutrition.calories' },
          avgCalories: { $avg: '$allFoods.nutrition.calories' },
          brand: { $first: '$allFoods.brand' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      message: 'Nutrition statistics retrieved successfully',
      data: {
        dateRange,
        groupBy,
        overallStats: overallStats[0] || {},
        groupedStats,
        topFoods
      }
    });

  } catch (error) {
    console.error('Get nutrition stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve nutrition statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Search food database (mock implementation - in real app, would use external API)
export const searchFoods = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    // Mock food database - in real app, integrate with USDA FoodData Central API or similar
    const mockFoods = [
      {
        name: 'Apple',
        brand: 'Generic',
        serving: { value: 1, unit: 'medium' },
        nutrition: { calories: 95, protein: 0.5, carbs: 25, fats: 0.3, fiber: 4 },
        category: 'fruit'
      },
      {
        name: 'Banana',
        brand: 'Generic',
        serving: { value: 1, unit: 'medium' },
        nutrition: { calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3 },
        category: 'fruit'
      },
      {
        name: 'Chicken Breast',
        brand: 'Generic',
        serving: { value: 100, unit: 'grams' },
        nutrition: { calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0 },
        category: 'protein'
      },
      {
        name: 'Brown Rice',
        brand: 'Generic',
        serving: { value: 100, unit: 'grams' },
        nutrition: { calories: 111, protein: 2.6, carbs: 23, fats: 0.9, fiber: 1.8 },
        category: 'grain'
      },
      {
        name: 'Broccoli',
        brand: 'Generic',
        serving: { value: 100, unit: 'grams' },
        nutrition: { calories: 34, protein: 2.8, carbs: 7, fats: 0.4, fiber: 2.6 },
        category: 'vegetable'
      },
      {
        name: 'Salmon',
        brand: 'Generic',
        serving: { value: 100, unit: 'grams' },
        nutrition: { calories: 206, protein: 22, carbs: 0, fats: 12, fiber: 0 },
        category: 'protein'
      },
      {
        name: 'Sweet Potato',
        brand: 'Generic',
        serving: { value: 100, unit: 'grams' },
        nutrition: { calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3 },
        category: 'vegetable'
      },
      {
        name: 'Greek Yogurt',
        brand: 'Generic',
        serving: { value: 100, unit: 'grams' },
        nutrition: { calories: 59, protein: 10, carbs: 3.6, fats: 0.4, fiber: 0 },
        category: 'dairy'
      },
      {
        name: 'Oatmeal',
        brand: 'Generic',
        serving: { value: 100, unit: 'grams' },
        nutrition: { calories: 68, protein: 2.4, carbs: 12, fats: 1.4, fiber: 1.7 },
        category: 'grain'
      },
      {
        name: 'Almonds',
        brand: 'Generic',
        serving: { value: 28, unit: 'grams' },
        nutrition: { calories: 161, protein: 6, carbs: 6, fats: 14, fiber: 3.5 },
        category: 'nuts'
      }
    ];

    // Filter foods based on search query
    const searchResults = mockFoods
      .filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Food search results retrieved successfully',
      data: {
        query,
        results: searchResults,
        total: searchResults.length
      }
    });

  } catch (error) {
    console.error('Search foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search foods',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
