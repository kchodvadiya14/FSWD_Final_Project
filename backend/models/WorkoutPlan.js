import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Workout plan name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    weeks: {
      type: Number,
      required: true,
      min: 1
    }
  },
  daysPerWeek: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  schedule: [{
    dayOfWeek: {
      type: Number, // 0 = Sunday, 1 = Monday, etc.
      required: true,
      min: 0,
      max: 6
    },
    workoutType: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'rest', 'mixed']
    },
    exercises: [{
      exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExerciseLibrary'
      },
      exerciseName: String,
      sets: Number,
      reps: String, // Can be a range like "8-12"
      weight: String, // Can be percentage of max or specific weight
      duration: Number, // For cardio exercises
      restTime: Number, // Rest between sets in seconds
      notes: String
    }]
  }],
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    enum: ['user', 'trainer', 'system'],
    default: 'user'
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate average rating
workoutPlanSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return sum / this.ratings.length;
};

export default mongoose.model('WorkoutPlan', workoutPlanSchema);