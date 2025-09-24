import Goal from '../models/Goal.js';

// Get all goals for user
export const getGoals = async (req, res) => {
  try {
    const { status, type } = req.query;
    
    const query = { userId: req.user.id };
    if (status) query.status = status;
    if (type) query.type = type;

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching goals'
    });
  }
};

// Get single goal
export const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching goal'
    });
  }
};

// Create new goal
export const createGoal = async (req, res) => {
  try {
    const goalData = {
      ...req.body,
      userId: req.user.id
    };

    const goal = new Goal(goalData);
    await goal.save();

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating goal'
    });
  }
};

// Update goal
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating goal'
    });
  }
};

// Update goal progress
export const updateGoalProgress = async (req, res) => {
  try {
    const { value, note } = req.body;

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Add progress entry
    goal.progress.push({
      value: parseFloat(value),
      note: note || '',
      date: new Date()
    });

    // Update current value
    goal.currentValue = parseFloat(value);

    // Check if goal is completed
    if (goal.currentValue >= goal.targetValue && goal.status === 'active') {
      goal.status = 'completed';
    }

    // Check milestones
    goal.milestones.forEach(milestone => {
      if (!milestone.achieved && goal.currentValue >= milestone.value) {
        milestone.achieved = true;
        milestone.achievedDate = new Date();
      }
    });

    await goal.save();

    res.json({
      success: true,
      message: 'Goal progress updated successfully',
      data: goal
    });
  } catch (error) {
    console.error('Update goal progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating goal progress'
    });
  }
};

// Delete goal
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting goal'
    });
  }
};

// Get goal statistics
export const getGoalStats = async (req, res) => {
  try {
    const stats = await Goal.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await Goal.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    const summary = {
      total: 0,
      active: 0,
      completed: 0,
      paused: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      summary.total += stat.count;
      summary[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        summary,
        byType: typeStats
      }
    });
  } catch (error) {
    console.error('Get goal stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching goal statistics'
    });
  }
};