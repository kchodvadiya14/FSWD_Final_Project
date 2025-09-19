import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    required: true
  },
  duration: {
    value: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute']
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours'],
      default: 'minutes'
    }
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'very_high'],
    default: 'moderate'
  },
  caloriesBurned: {
    type: Number,
    min: [0, 'Calories burned cannot be negative'],
    default: 0
  },
  sets: {
    type: Number,
    min: [0, 'Sets cannot be negative']
  },
  reps: {
    type: Number,
    min: [0, 'Reps cannot be negative']
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  distance: {
    value: Number,
    unit: {
      type: String,
      enum: ['km', 'miles', 'meters'],
      default: 'km'
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Workout title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Workout date is required'],
    default: Date.now
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  totalDuration: {
    value: {
      type: Number,
      min: [1, 'Total duration must be at least 1 minute']
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours'],
      default: 'minutes'
    }
  },
  exercises: [exerciseSchema],
  totalCaloriesBurned: {
    type: Number,
    default: 0,
    min: [0, 'Total calories burned cannot be negative']
  },
  workoutType: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'mixed', 'sports'],
    default: 'mixed'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  location: {
    type: String,
    enum: ['home', 'gym', 'outdoor', 'office', 'other'],
    default: 'gym'
  },
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'snowy', 'indoor'],
    default: 'indoor'
  },
  mood: {
    before: {
      type: String,
      enum: ['excellent', 'good', 'neutral', 'tired', 'stressed'],
      default: 'neutral'
    },
    after: {
      type: String,
      enum: ['excellent', 'good', 'neutral', 'tired', 'stressed'],
      default: 'good'
    }
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isCompleted: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
workoutSchema.index({ userId: 1, date: -1 });
workoutSchema.index({ userId: 1, workoutType: 1 });
workoutSchema.index({ userId: 1, createdAt: -1 });
workoutSchema.index({ tags: 1 });

// Virtual for workout duration in minutes
workoutSchema.virtual('durationInMinutes').get(function() {
  if (this.startTime && this.endTime) {
    return Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  if (this.totalDuration?.value && this.totalDuration?.unit) {
    return this.totalDuration.unit === 'hours' 
      ? this.totalDuration.value * 60 
      : this.totalDuration.value;
  }
  return 0;
});

// Virtual for calories burned per minute
workoutSchema.virtual('caloriesPerMinute').get(function() {
  const duration = this.durationInMinutes;
  return duration > 0 ? Math.round((this.totalCaloriesBurned / duration) * 10) / 10 : 0;
});

// Pre-save middleware to calculate total calories and duration
workoutSchema.pre('save', function(next) {
  // Calculate total calories burned from exercises
  if (this.exercises && this.exercises.length > 0) {
    this.totalCaloriesBurned = this.exercises.reduce((total, exercise) => {
      return total + (exercise.caloriesBurned || 0);
    }, 0);
  }

  // Calculate total duration if start and end times are provided
  if (this.startTime && this.endTime && !this.totalDuration?.value) {
    const durationInMinutes = Math.round((this.endTime - this.startTime) / (1000 * 60));
    this.totalDuration = {
      value: durationInMinutes,
      unit: 'minutes'
    };
  }

  // Determine workout type based on exercises
  if (this.exercises && this.exercises.length > 0 && !this.isModified('workoutType')) {
    const categories = this.exercises.map(ex => ex.category);
    const uniqueCategories = [...new Set(categories)];
    
    if (uniqueCategories.length === 1) {
      this.workoutType = uniqueCategories[0];
    } else {
      this.workoutType = 'mixed';
    }
  }

  next();
});

// Static method to get workout statistics for a user
workoutSchema.statics.getWorkoutStats = async function(userId, dateRange = {}) {
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
        totalWorkouts: { $sum: 1 },
        totalCaloriesBurned: { $sum: '$totalCaloriesBurned' },
        totalDuration: { $sum: '$durationInMinutes' },
        avgCaloriesPerWorkout: { $avg: '$totalCaloriesBurned' },
        avgDurationPerWorkout: { $avg: '$durationInMinutes' },
        workoutTypes: { $push: '$workoutType' }
      }
    },
    {
      $project: {
        _id: 0,
        totalWorkouts: 1,
        totalCaloriesBurned: 1,
        totalDuration: 1,
        avgCaloriesPerWorkout: { $round: ['$avgCaloriesPerWorkout', 1] },
        avgDurationPerWorkout: { $round: ['$avgDurationPerWorkout', 1] },
        workoutTypeDistribution: {
          $arrayToObject: {
            $map: {
              input: { $setUnion: ['$workoutTypes', []] },
              as: 'type',
              in: {
                k: '$$type',
                v: {
                  $size: {
                    $filter: {
                      input: '$workoutTypes',
                      cond: { $eq: ['$$this', '$$type'] }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]);
};

// Instance method to calculate estimated calories burned
workoutSchema.methods.calculateEstimatedCalories = function(userWeight = 70) {
  // MET (Metabolic Equivalent) values for different activities
  const metValues = {
    cardio: {
      low: 4,
      moderate: 6,
      high: 8,
      very_high: 10
    },
    strength: {
      low: 3,
      moderate: 5,
      high: 6,
      very_high: 8
    },
    flexibility: {
      low: 2,
      moderate: 3,
      high: 4,
      very_high: 5
    },
    sports: {
      low: 5,
      moderate: 7,
      high: 9,
      very_high: 12
    },
    other: {
      low: 3,
      moderate: 4,
      high: 5,
      very_high: 6
    }
  };

  let totalCalories = 0;
  
  this.exercises.forEach(exercise => {
    const met = metValues[exercise.category]?.[exercise.intensity] || 4;
    const durationInHours = exercise.duration.unit === 'hours' 
      ? exercise.duration.value 
      : exercise.duration.value / 60;
    
    // Calories = MET × weight(kg) × time(hours)
    const calories = met * userWeight * durationInHours;
    totalCalories += calories;
  });

  return Math.round(totalCalories);
};

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
