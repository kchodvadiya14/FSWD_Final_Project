import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'endurance', 'strength', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    required: true // kg, lbs, minutes, km, etc.
  },
  targetDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  milestones: [{
    value: Number,
    description: String,
    achieved: {
      type: Boolean,
      default: false
    },
    achievedDate: Date
  }],
  progress: [{
    date: {
      type: Date,
      default: Date.now
    },
    value: Number,
    note: String
  }]
}, {
  timestamps: true
});

// Calculate progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  if (this.targetValue === 0) return 0;
  return Math.min(100, (this.currentValue / this.targetValue) * 100);
});

goalSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Goal', goalSchema);