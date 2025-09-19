import mongoose from 'mongoose';

const bodyMeasurementSchema = new mongoose.Schema({
  chest: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  waist: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  hips: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  biceps: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  thighs: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  neck: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  forearms: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  calves: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  }
});

const vitalSignsSchema = new mongoose.Schema({
  bloodPressure: {
    systolic: {
      type: Number,
      min: [70, 'Systolic pressure too low'],
      max: [250, 'Systolic pressure too high']
    },
    diastolic: {
      type: Number,
      min: [40, 'Diastolic pressure too low'],
      max: [150, 'Diastolic pressure too high']
    }
  },
  heartRate: {
    resting: {
      type: Number,
      min: [30, 'Resting heart rate too low'],
      max: [200, 'Resting heart rate too high']
    },
    active: {
      type: Number,
      min: [50, 'Active heart rate too low'],
      max: [220, 'Active heart rate too high']
    }
  },
  bodyTemperature: {
    value: {
      type: Number,
      min: [35, 'Body temperature too low'],
      max: [42, 'Body temperature too high']
    },
    unit: {
      type: String,
      enum: ['celsius', 'fahrenheit'],
      default: 'celsius'
    }
  },
  oxygenSaturation: {
    type: Number,
    min: [85, 'Oxygen saturation too low'],
    max: [100, 'Oxygen saturation cannot exceed 100%']
  }
});

const healthMetricsSchema = new mongoose.Schema({
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
  weight: {
    value: {
      type: Number,
      required: [true, 'Weight value is required'],
      min: [20, 'Weight must be at least 20kg'],
      max: [500, 'Weight cannot exceed 500kg']
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  bodyFatPercentage: {
    type: Number,
    min: [3, 'Body fat percentage too low'],
    max: [60, 'Body fat percentage too high']
  },
  muscleMass: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  boneDensity: {
    type: Number,
    min: [0.5, 'Bone density too low'],
    max: [3.0, 'Bone density too high']
  },
  bodyWaterPercentage: {
    type: Number,
    min: [30, 'Body water percentage too low'],
    max: [80, 'Body water percentage too high']
  },
  visceralFat: {
    type: Number,
    min: [1, 'Visceral fat level too low'],
    max: [30, 'Visceral fat level too high']
  },
  bmi: {
    type: Number,
    min: [10, 'BMI too low'],
    max: [60, 'BMI too high']
  },
  bodyMeasurements: bodyMeasurementSchema,
  vitalSigns: vitalSignsSchema,
  sleepData: {
    duration: {
      hours: {
        type: Number,
        min: [0, 'Sleep hours cannot be negative'],
        max: [24, 'Sleep hours cannot exceed 24']
      },
      minutes: {
        type: Number,
        min: [0, 'Sleep minutes cannot be negative'],
        max: [59, 'Sleep minutes cannot exceed 59']
      }
    },
    quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
      default: 'good'
    },
    bedtime: {
      type: Date
    },
    wakeupTime: {
      type: Date
    },
    deepSleep: {
      type: Number,
      min: [0, 'Deep sleep percentage cannot be negative'],
      max: [100, 'Deep sleep percentage cannot exceed 100']
    },
    remSleep: {
      type: Number,
      min: [0, 'REM sleep percentage cannot be negative'],
      max: [100, 'REM sleep percentage cannot exceed 100']
    }
  },
  stressLevel: {
    type: String,
    enum: ['very_low', 'low', 'moderate', 'high', 'very_high'],
    default: 'moderate'
  },
  energyLevel: {
    type: String,
    enum: ['very_low', 'low', 'moderate', 'high', 'very_high'],
    default: 'moderate'
  },
  mood: {
    type: String,
    enum: ['very_poor', 'poor', 'neutral', 'good', 'excellent'],
    default: 'neutral'
  },
  hydrationLevel: {
    type: String,
    enum: ['dehydrated', 'slightly_dehydrated', 'normal', 'well_hydrated'],
    default: 'normal'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  photos: [{
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['front', 'side', 'back', 'progress'],
      required: true
    },
    description: String
  }],
  goals: [{
    type: {
      type: String,
      enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'fat_loss', 'endurance', 'strength'],
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    achieved: {
      type: Boolean,
      default: false
    },
    notes: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
healthMetricsSchema.index({ userId: 1, date: -1 });
healthMetricsSchema.index({ userId: 1, createdAt: -1 });
healthMetricsSchema.index({ userId: 1, 'weight.value': 1 });

// Virtual for weight in kg (standardized)
healthMetricsSchema.virtual('weightInKg').get(function() {
  if (!this.weight?.value) return 0;
  
  return this.weight.unit === 'lbs' 
    ? Math.round((this.weight.value * 0.453592) * 100) / 100 
    : this.weight.value;
});

// Virtual for total sleep duration in minutes
healthMetricsSchema.virtual('totalSleepMinutes').get(function() {
  const hours = this.sleepData?.duration?.hours || 0;
  const minutes = this.sleepData?.duration?.minutes || 0;
  return (hours * 60) + minutes;
});

// Virtual for BMI category
healthMetricsSchema.virtual('bmiCategory').get(function() {
  const bmi = this.bmi;
  if (!bmi) return 'unknown';
  
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
});

// Virtual for body fat category
healthMetricsSchema.virtual('bodyFatCategory').get(function() {
  const bodyFat = this.bodyFatPercentage;
  if (!bodyFat) return 'unknown';
  
  // Categories vary by gender, using general categories
  if (bodyFat < 10) return 'essential';
  if (bodyFat < 16) return 'athletic';
  if (bodyFat < 20) return 'fitness';
  if (bodyFat < 25) return 'average';
  return 'obese';
});

// Pre-save middleware to calculate BMI if weight is provided
healthMetricsSchema.pre('save', async function(next) {
  try {
    // Calculate BMI if we have weight and can get height from user
    if (this.weight?.value && this.userId) {
      const User = mongoose.model('User');
      const user = await User.findById(this.userId);
      
      if (user?.profile?.height?.value) {
        const weightInKg = this.weightInKg;
        const heightInM = user.profile.height.value / 100;
        this.bmi = Math.round((weightInKg / (heightInM * heightInM)) * 10) / 10;
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to get health trends for a user
healthMetricsSchema.statics.getHealthTrends = async function(userId, dateRange = {}, metric = 'weight') {
  const matchStage = { userId: new mongoose.Types.ObjectId(userId) };
  
  if (dateRange.start || dateRange.end) {
    matchStage.date = {};
    if (dateRange.start) matchStage.date.$gte = new Date(dateRange.start);
    if (dateRange.end) matchStage.date.$lte = new Date(dateRange.end);
  }

  const pipeline = [
    { $match: matchStage },
    { $sort: { date: 1 } }
  ];

  if (metric === 'weight') {
    pipeline.push({
      $project: {
        date: 1,
        value: '$weight.value',
        unit: '$weight.unit',
        bmi: 1
      }
    });
  } else if (metric === 'bodyFat') {
    pipeline.push({
      $project: {
        date: 1,
        value: '$bodyFatPercentage'
      }
    });
  } else if (metric === 'sleep') {
    pipeline.push({
      $project: {
        date: 1,
        value: {
          $add: [
            { $multiply: [{ $ifNull: ['$sleepData.duration.hours', 0] }, 60] },
            { $ifNull: ['$sleepData.duration.minutes', 0] }
          ]
        },
        quality: '$sleepData.quality'
      }
    });
  }

  return await this.aggregate(pipeline);
};

// Static method to get latest metrics for dashboard
healthMetricsSchema.statics.getLatestMetrics = async function(userId) {
  return await this.findOne({ userId }).sort({ date: -1 });
};

// Static method to calculate progress towards goals
healthMetricsSchema.statics.calculateGoalProgress = async function(userId) {
  const latest = await this.getLatestMetrics(userId);
  const User = mongoose.model('User');
  const user = await User.findById(userId);
  
  if (!latest || !user) return null;

  const progress = {};
  
  // Weight goal progress
  if (user.profile?.targetWeight?.value && user.profile?.currentWeight?.value) {
    const current = latest.weightInKg;
    const target = user.profile.targetWeight.value;
    const start = user.profile.currentWeight.value;
    
    const totalChange = Math.abs(target - start);
    const currentChange = Math.abs(current - start);
    
    progress.weight = {
      current,
      target,
      percentage: totalChange > 0 ? Math.round((currentChange / totalChange) * 100) : 0,
      remaining: Math.abs(target - current)
    };
  }

  return progress;
};

// Instance method to compare with previous entry
healthMetricsSchema.methods.compareWithPrevious = async function() {
  const previous = await this.constructor.findOne({
    userId: this.userId,
    date: { $lt: this.date }
  }).sort({ date: -1 });

  if (!previous) return null;

  const comparison = {};
  
  if (this.weight?.value && previous.weight?.value) {
    const currentWeight = this.weightInKg;
    const previousWeight = previous.weightInKg;
    comparison.weight = {
      change: Math.round((currentWeight - previousWeight) * 100) / 100,
      percentage: Math.round(((currentWeight - previousWeight) / previousWeight) * 10000) / 100
    };
  }

  if (this.bmi && previous.bmi) {
    comparison.bmi = {
      change: Math.round((this.bmi - previous.bmi) * 10) / 10
    };
  }

  if (this.bodyFatPercentage && previous.bodyFatPercentage) {
    comparison.bodyFat = {
      change: Math.round((this.bodyFatPercentage - previous.bodyFatPercentage) * 10) / 10
    };
  }

  return comparison;
};

const HealthMetrics = mongoose.model('HealthMetrics', healthMetricsSchema);

export default HealthMetrics;
