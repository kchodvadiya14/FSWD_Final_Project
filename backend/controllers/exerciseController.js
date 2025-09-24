import ExerciseLibrary from '../models/ExerciseLibrary.js';

// Get all exercises from library
export const getExercises = async (req, res) => {
  try {
    const { 
      category, 
      equipment, 
      difficulty, 
      muscle, 
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (equipment) query.equipment = equipment;
    if (difficulty) query.difficulty = difficulty;
    if (muscle) {
      query.$or = [
        { primaryMuscles: { $in: [muscle] } },
        { secondaryMuscles: { $in: [muscle] } }
      ];
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { primaryMuscles: { $in: [new RegExp(search, 'i')] } },
        { secondaryMuscles: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const exercises = await ExerciseLibrary.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const total = await ExerciseLibrary.countDocuments(query);

    res.json({
      success: true,
      data: exercises,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalExercises: total,
        hasMore: skip + exercises.length < total
      }
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exercises'
    });
  }
};

// Get single exercise
export const getExercise = async (req, res) => {
  try {
    const exercise = await ExerciseLibrary.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exercise'
    });
  }
};

// Get exercise categories
export const getCategories = async (req, res) => {
  try {
    // Use aggregation pipeline instead of distinct to avoid API Version 1 issues
    const [categoriesResult, equipmentResult, musclesResult] = await Promise.all([
      ExerciseLibrary.aggregate([
        { $group: { _id: '$category' } },
        { $sort: { _id: 1 } }
      ]),
      ExerciseLibrary.aggregate([
        { $group: { _id: '$equipment' } },
        { $sort: { _id: 1 } }
      ]),
      ExerciseLibrary.aggregate([
        { $unwind: '$primaryMuscles' },
        { $group: { _id: '$primaryMuscles' } },
        { $sort: { _id: 1 } }
      ])
    ]);

    const categories = categoriesResult.map(item => item._id).filter(Boolean);
    const equipment = equipmentResult.map(item => item._id).filter(Boolean);
    const muscles = musclesResult.map(item => item._id).filter(Boolean);

    res.json({
      success: true,
      data: {
        categories,
        equipment,
        muscles
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

// Add new exercise (admin only)
export const createExercise = async (req, res) => {
  try {
    const exercise = new ExerciseLibrary(req.body);
    await exercise.save();

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully',
      data: exercise
    });
  } catch (error) {
    console.error('Create exercise error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Exercise with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating exercise'
    });
  }
};

// Seed initial exercises
export const seedExercises = async (req, res) => {
  try {
    const existingCount = await ExerciseLibrary.countDocuments();
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: 'Exercise library already populated',
        count: existingCount
      });
    }

    const exercises = [
      {
        name: 'Push-ups',
        category: 'chest',
        primaryMuscles: ['chest', 'triceps'],
        secondaryMuscles: ['shoulders', 'core'],
        equipment: 'bodyweight',
        difficulty: 'beginner',
        instructions: [
          { step: 1, description: 'Start in a plank position with hands slightly wider than shoulders' },
          { step: 2, description: 'Lower your body until chest nearly touches the floor' },
          { step: 3, description: 'Push back up to starting position' }
        ],
        tips: ['Keep your core tight throughout the movement', 'Maintain a straight line from head to heels'],
        caloriesPerMinute: 8
      },
      {
        name: 'Squats',
        category: 'legs',
        primaryMuscles: ['quadriceps', 'glutes'],
        secondaryMuscles: ['hamstrings', 'calves', 'core'],
        equipment: 'bodyweight',
        difficulty: 'beginner',
        instructions: [
          { step: 1, description: 'Stand with feet shoulder-width apart' },
          { step: 2, description: 'Lower down as if sitting back into a chair' },
          { step: 3, description: 'Keep chest up and knees behind toes' },
          { step: 4, description: 'Return to standing position' }
        ],
        tips: ['Keep your weight on your heels', 'Don\'t let knees cave inward'],
        caloriesPerMinute: 6
      },
      {
        name: 'Deadlift',
        category: 'back',
        primaryMuscles: ['hamstrings', 'glutes', 'lower back'],
        secondaryMuscles: ['traps', 'lats', 'forearms'],
        equipment: 'barbell',
        difficulty: 'intermediate',
        instructions: [
          { step: 1, description: 'Stand with feet hip-width apart, bar over mid-foot' },
          { step: 2, description: 'Bend at hips and knees to grip the bar' },
          { step: 3, description: 'Keep chest up and back straight' },
          { step: 4, description: 'Drive through heels to stand up' }
        ],
        tips: ['Keep the bar close to your body', 'Engage your core throughout'],
        caloriesPerMinute: 10
      }
      // Add more exercises as needed
    ];

    const createdExercises = await ExerciseLibrary.insertMany(exercises);

    res.status(201).json({
      success: true,
      message: 'Exercise library seeded successfully',
      count: createdExercises.length,
      data: createdExercises
    });
  } catch (error) {
    console.error('Seed exercises error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while seeding exercises'
    });
  }
};