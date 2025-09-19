import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  quantity: {
    value: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity must be positive']
    },
    unit: {
      type: String,
      enum: ['grams', 'kg', 'ml', 'liters', 'cups', 'pieces', 'tablespoons', 'teaspoons', 'ounces'],
      required: true,
      default: 'grams'
    }
  },
  nutrition: {
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative']
    },
    protein: {
      type: Number,
      min: [0, 'Protein cannot be negative'],
      default: 0
    },
    carbs: {
      type: Number,
      min: [0, 'Carbs cannot be negative'],
      default: 0
    },
    fats: {
      type: Number,
      min: [0, 'Fats cannot be negative'],
      default: 0
    },
    fiber: {
      type: Number,
      min: [0, 'Fiber cannot be negative'],
      default: 0
    },
    sugar: {
      type: Number,
      min: [0, 'Sugar cannot be negative'],
      default: 0
    },
    sodium: {
      type: Number,
      min: [0, 'Sodium cannot be negative'],
      default: 0
    },
    cholesterol: {
      type: Number,
      min: [0, 'Cholesterol cannot be negative'],
      default: 0
    },
    saturatedFat: {
      type: Number,
      min: [0, 'Saturated fat cannot be negative'],
      default: 0
    }
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'drink', 'supplement'],
    required: true
  },
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  }
});

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  meals: {
    breakfast: [foodItemSchema],
    lunch: [foodItemSchema],
    dinner: [foodItemSchema],
    snacks: [foodItemSchema]
  },
  water: {
    intake: {
      type: Number,
      min: [0, 'Water intake cannot be negative'],
      default: 0
    },
    unit: {
      type: String,
      enum: ['ml', 'liters', 'cups', 'ounces'],
      default: 'ml'
    },
    target: {
      type: Number,
      default: 2000 // 2 liters default
    }
  },
  supplements: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    dosage: {
      type: String,
      required: true
    },
    timing: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'with_meal', 'before_workout', 'after_workout'],
      default: 'morning'
    },
    notes: String
  }],
  dailyTotals: {
    calories: {
      type: Number,
      default: 0,
      min: [0, 'Total calories cannot be negative']
    },
    protein: {
      type: Number,
      default: 0,
      min: [0, 'Total protein cannot be negative']
    },
    carbs: {
      type: Number,
      default: 0,
      min: [0, 'Total carbs cannot be negative']
    },
    fats: {
      type: Number,
      default: 0,
      min: [0, 'Total fats cannot be negative']
    },
    fiber: {
      type: Number,
      default: 0,
      min: [0, 'Total fiber cannot be negative']
    },
    sugar: {
      type: Number,
      default: 0,
      min: [0, 'Total sugar cannot be negative']
    },
    sodium: {
      type: Number,
      default: 0,
      min: [0, 'Total sodium cannot be negative']
    }
  },
  targets: {
    calories: {
      type: Number,
      default: 2000
    },
    protein: {
      type: Number,
      default: 50 // grams
    },
    carbs: {
      type: Number,
      default: 250 // grams
    },
    fats: {
      type: Number,
      default: 65 // grams
    },
    fiber: {
      type: Number,
      default: 25 // grams
    },
    sugar: {
      type: Number,
      default: 50 // grams
    },
    sodium: {
      type: Number,
      default: 2300 // mg
    }
  },
  mood: {
    energy: {
      type: String,
      enum: ['very_low', 'low', 'moderate', 'high', 'very_high'],
      default: 'moderate'
    },
    hunger: {
      type: String,
      enum: ['very_hungry', 'hungry', 'satisfied', 'full', 'very_full'],
      default: 'satisfied'
    },
    cravings: [{
      type: String,
      enum: ['sweet', 'salty', 'fatty', 'spicy', 'none']
    }]
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
nutritionSchema.index({ userId: 1, date: -1 });
nutritionSchema.index({ userId: 1, createdAt: -1 });

// Virtual for total water intake in liters
nutritionSchema.virtual('waterIntakeInLiters').get(function() {
  const intake = this.water.intake || 0;
  const unit = this.water.unit || 'ml';
  
  switch (unit) {
    case 'liters':
      return intake;
    case 'ml':
      return intake / 1000;
    case 'cups':
      return intake * 0.236588; // 1 cup = 236.588 ml
    case 'ounces':
      return intake * 0.0295735; // 1 fl oz = 29.5735 ml
    default:
      return intake / 1000;
  }
});

// Virtual for macro percentages
nutritionSchema.virtual('macroPercentages').get(function() {
  const calories = this.dailyTotals.calories || 0;
  if (calories === 0) return { protein: 0, carbs: 0, fats: 0 };

  return {
    protein: Math.round(((this.dailyTotals.protein * 4) / calories) * 100),
    carbs: Math.round(((this.dailyTotals.carbs * 4) / calories) * 100),
    fats: Math.round(((this.dailyTotals.fats * 9) / calories) * 100)
  };
});

// Virtual for target achievement percentages
nutritionSchema.virtual('targetAchievement').get(function() {
  return {
    calories: this.targets.calories > 0 ? Math.round((this.dailyTotals.calories / this.targets.calories) * 100) : 0,
    protein: this.targets.protein > 0 ? Math.round((this.dailyTotals.protein / this.targets.protein) * 100) : 0,
    carbs: this.targets.carbs > 0 ? Math.round((this.dailyTotals.carbs / this.targets.carbs) * 100) : 0,
    fats: this.targets.fats > 0 ? Math.round((this.dailyTotals.fats / this.targets.fats) * 100) : 0,
    fiber: this.targets.fiber > 0 ? Math.round((this.dailyTotals.fiber / this.targets.fiber) * 100) : 0
  };
});

// Pre-save middleware to calculate daily totals
nutritionSchema.pre('save', function(next) {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };

  // Calculate totals from all meals
  Object.values(this.meals).forEach(meal => {
    if (Array.isArray(meal)) {
      meal.forEach(food => {
        if (food.nutrition) {
          totals.calories += food.nutrition.calories || 0;
          totals.protein += food.nutrition.protein || 0;
          totals.carbs += food.nutrition.carbs || 0;
          totals.fats += food.nutrition.fats || 0;
          totals.fiber += food.nutrition.fiber || 0;
          totals.sugar += food.nutrition.sugar || 0;
          totals.sodium += food.nutrition.sodium || 0;
        }
      });
    }
  });

  // Round to 1 decimal place
  Object.keys(totals).forEach(key => {
    this.dailyTotals[key] = Math.round(totals[key] * 10) / 10;
  });

  next();
});

// Static method to get nutrition statistics for a user
nutritionSchema.statics.getNutritionStats = async function(userId, dateRange = {}) {
  const matchStage = { userId: new mongoose.Types.ObjectId(userId) };
  
  if (dateRange.start || dateRange.end) {
    matchStage.date = {};
    if (dateRange.start) matchStage.date.$gte = new Date(dateRange.start);
    if (dateRange.end) matchStage.date.$lte = new Date(dateRange.end);
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalDays: { $sum: 1 },
        avgCalories: { $avg: '$dailyTotals.calories' },
        avgProtein: { $avg: '$dailyTotals.protein' },
        avgCarbs: { $avg: '$dailyTotals.carbs' },
        avgFats: { $avg: '$dailyTotals.fats' },
        avgFiber: { $avg: '$dailyTotals.fiber' },
        avgWaterIntake: { $avg: '$water.intake' },
        totalCalories: { $sum: '$dailyTotals.calories' },
        maxCalories: { $max: '$dailyTotals.calories' },
        minCalories: { $min: '$dailyTotals.calories' }
      }
    },
    {
      $project: {
        _id: 0,
        totalDays: 1,
        avgCalories: { $round: ['$avgCalories', 1] },
        avgProtein: { $round: ['$avgProtein', 1] },
        avgCarbs: { $round: ['$avgCarbs', 1] },
        avgFats: { $round: ['$avgFats', 1] },
        avgFiber: { $round: ['$avgFiber', 1] },
        avgWaterIntake: { $round: ['$avgWaterIntake', 1] },
        totalCalories: { $round: ['$totalCalories', 0] },
        maxCalories: 1,
        minCalories: 1
      }
    }
  ]);
};

// Instance method to add food item to meal
nutritionSchema.methods.addFoodItem = function(mealType, foodItem) {
  if (!this.meals[mealType]) {
    throw new Error(`Invalid meal type: ${mealType}`);
  }
  
  this.meals[mealType].push(foodItem);
  return this;
};

// Instance method to calculate calorie deficit/surplus
nutritionSchema.methods.calculateCalorieBalance = function(caloriesBurned = 0) {
  const consumed = this.dailyTotals.calories || 0;
  const target = this.targets.calories || 2000;
  const net = consumed - caloriesBurned;
  
  return {
    consumed,
    burned: caloriesBurned,
    net,
    target,
    deficit: target - net,
    surplus: net - target > 0 ? net - target : 0
  };
};

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

export default Nutrition;
