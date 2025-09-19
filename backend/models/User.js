import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  
  // Profile Information
  profile: {
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age cannot exceed 120']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      lowercase: true
    },
    height: {
      value: Number, // in cm
      unit: {
        type: String,
        default: 'cm'
      }
    },
    currentWeight: {
      value: Number, // in kg
      unit: {
        type: String,
        default: 'kg'
      }
    },
    targetWeight: {
      value: Number, // in kg
      unit: {
        type: String,
        default: 'kg'
      }
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'super_active'],
      default: 'moderately_active'
    },
    fitnessGoal: {
      type: String,
      enum: ['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle', 'improve_fitness'],
      default: 'maintain_weight'
    }
  },

  // Calculated Fields
  bmi: {
    type: Number,
    default: 0
  },
  bmr: { // Basal Metabolic Rate
    type: Number,
    default: 0
  },
  dailyCalorieTarget: {
    type: Number,
    default: 2000
  },

  // Account Settings
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },

  // Preferences
  preferences: {
    units: {
      weight: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
      },
      height: {
        type: String,
        enum: ['cm', 'ft'],
        default: 'cm'
      },
      distance: {
        type: String,
        enum: ['km', 'miles'],
        default: 'km'
      }
    },
    notifications: {
      workoutReminders: {
        type: Boolean,
        default: true
      },
      mealReminders: {
        type: Boolean,
        default: true
      },
      progressUpdates: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for BMI calculation
userSchema.virtual('calculatedBMI').get(function() {
  if (this.profile.height?.value && this.profile.currentWeight?.value) {
    const heightInMeters = this.profile.height.value / 100;
    return Math.round((this.profile.currentWeight.value / (heightInMeters * heightInMeters)) * 10) / 10;
  }
  return 0;
});

// Virtual for BMR calculation (Mifflin-St Jeor Equation)
userSchema.virtual('calculatedBMR').get(function() {
  if (this.profile.currentWeight?.value && this.profile.height?.value && this.profile.age && this.profile.gender) {
    const weight = this.profile.currentWeight.value;
    const height = this.profile.height.value;
    const age = this.profile.age;
    const gender = this.profile.gender;

    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    return Math.round(bmr);
  }
  return 0;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to calculate BMI and BMR
userSchema.pre('save', function(next) {
  // Calculate and update BMI
  if (this.profile.height?.value && this.profile.currentWeight?.value) {
    this.bmi = this.calculatedBMI;
  }

  // Calculate and update BMR
  if (this.profile.currentWeight?.value && this.profile.height?.value && this.profile.age && this.profile.gender) {
    this.bmr = this.calculatedBMR;
    
    // Calculate daily calorie target based on activity level
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      super_active: 1.9
    };
    
    const multiplier = activityMultipliers[this.profile.activityLevel] || 1.55;
    this.dailyCalorieTarget = Math.round(this.bmr * multiplier);
    
    // Adjust for fitness goal
    if (this.profile.fitnessGoal === 'lose_weight') {
      this.dailyCalorieTarget -= 500; // 500 calorie deficit for weight loss
    } else if (this.profile.fitnessGoal === 'gain_weight' || this.profile.fitnessGoal === 'build_muscle') {
      this.dailyCalorieTarget += 300; // 300 calorie surplus for weight gain
    }
  }

  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

export default User;
