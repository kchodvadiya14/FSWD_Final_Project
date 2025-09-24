import mongoose from 'mongoose';

const exerciseLibrarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'full-body'],
    required: true
  },
  primaryMuscles: [{
    type: String,
    required: true
  }],
  secondaryMuscles: [{
    type: String
  }],
  equipment: {
    type: String,
    enum: ['bodyweight', 'dumbbells', 'barbell', 'machine', 'cables', 'resistance_bands', 'kettlebell', 'other'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  instructions: [{
    step: Number,
    description: String
  }],
  tips: [String],
  image: String,
  videoUrl: String,
  caloriesPerMinute: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

export default mongoose.model('ExerciseLibrary', exerciseLibrarySchema);