# Complete MongoDB Schema for Fitness Tracking Application

## Core Collections

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  avatar: String (URL),
  isEmailVerified: Boolean,
  role: String (enum: ['user', 'trainer', 'admin']),
  
  profile: {
    age: Number,
    gender: String (enum: ['male', 'female', 'other']),
    height: {
      value: Number,
      unit: String (enum: ['cm', 'ft'])
    },
    currentWeight: {
      value: Number,
      unit: String (enum: ['kg', 'lbs'])
    },
    activityLevel: String (enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'super_active']),
    fitnessGoal: String (enum: ['lose_weight', 'gain_weight', 'build_muscle', 'improve_fitness', 'maintain_weight']),
    targetWeight: {
      value: Number,
      unit: String,
      deadline: Date
    },
    preferences: {
      units: String (enum: ['metric', 'imperial']),
      timezone: String,
      language: String
    }
  },
  
  settings: {
    notifications: {
      workoutReminders: Boolean,
      nutritionAlerts: Boolean,
      progressUpdates: Boolean,
      email: Boolean,
      push: Boolean
    },
    privacy: {
      profileVisibility: String (enum: ['public', 'friends', 'private']),
      shareProgress: Boolean
    }
  },
  
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Workouts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  name: String,
  type: String (enum: ['strength', 'cardio', 'flexibility', 'sports', 'other']),
  date: Date,
  duration: Number, // minutes
  
  exercises: [{
    exerciseId: ObjectId (ref: 'Exercise'),
    name: String,
    sets: [{
      reps: Number,
      weight: {
        value: Number,
        unit: String
      },
      duration: Number, // seconds
      distance: {
        value: Number,
        unit: String
      },
      restTime: Number, // seconds
      notes: String
    }],
    totalVolume: Number, // calculated field
    personalRecord: Boolean
  }],
  
  metrics: {
    totalCaloriesBurned: Number,
    averageHeartRate: Number,
    maxHeartRate: Number,
    totalSteps: Number,
    totalDistance: {
      value: Number,
      unit: String
    }
  },
  
  notes: String,
  mood: String (enum: ['excellent', 'good', 'average', 'poor', 'terrible']),
  difficultyRating: Number (1-10),
  
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Exercises Library Collection
```javascript
{
  _id: ObjectId,
  name: String,
  category: String (enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'flexibility']),
  muscleGroups: [String],
  equipment: [String],
  difficulty: String (enum: ['beginner', 'intermediate', 'advanced']),
  
  instructions: [String],
  tips: [String],
  
  media: {
    images: [String], // URLs
    videos: [{
      url: String,
      type: String (enum: ['demonstration', 'tutorial']),
      duration: Number
    }],
    animations: [String] // URLs to GIFs
  },
  
  metrics: {
    defaultSets: Number,
    defaultReps: Number,
    defaultDuration: Number,
    caloriesPerMinute: Number
  },
  
  variations: [{
    name: String,
    description: String,
    difficulty: String
  }],
  
  isApproved: Boolean,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Nutrition Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  date: Date,
  
  meals: [{
    type: String (enum: ['breakfast', 'lunch', 'dinner', 'snack']),
    time: Date,
    foods: [{
      foodId: ObjectId (ref: 'Food'),
      name: String,
      quantity: {
        amount: Number,
        unit: String
      },
      calories: Number,
      macros: {
        protein: Number, // grams
        carbs: Number,
        fat: Number,
        fiber: Number,
        sugar: Number
      },
      micros: {
        sodium: Number, // mg
        potassium: Number,
        calcium: Number,
        iron: Number,
        vitaminC: Number,
        vitaminD: Number
      }
    }],
    totalCalories: Number,
    notes: String
  }],
  
  dailyTotals: {
    calories: Number,
    macros: {
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number
    },
    water: {
      amount: Number,
      unit: String
    }
  },
  
  goals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    water: Number
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Food Database Collection
```javascript
{
  _id: ObjectId,
  name: String,
  brand: String,
  category: String,
  barcode: String,
  
  nutrition: {
    servingSize: {
      amount: Number,
      unit: String
    },
    calories: Number, // per serving
    macros: {
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number
    },
    micros: {
      sodium: Number,
      potassium: Number,
      calcium: Number,
      iron: Number
    }
  },
  
  verified: Boolean,
  source: String (enum: ['usda', 'user_submitted', 'brand_official']),
  createdAt: Date
}
```

### 6. Goals Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  
  type: String (enum: ['weight', 'body_fat', 'muscle_mass', 'strength', 'endurance', 'nutrition']),
  title: String,
  description: String,
  
  target: {
    value: Number,
    unit: String,
    metric: String // e.g., 'weight', 'bench_press_1rm', 'running_5k_time'
  },
  
  current: {
    value: Number,
    lastUpdated: Date
  },
  
  timeline: {
    startDate: Date,
    targetDate: Date,
    milestones: [{
      date: Date,
      value: Number,
      notes: String
    }]
  },
  
  status: String (enum: ['active', 'completed', 'paused', 'cancelled']),
  priority: String (enum: ['low', 'medium', 'high']),
  
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Progress Tracking Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  date: Date,
  
  measurements: {
    weight: {
      value: Number,
      unit: String
    },
    bodyFat: Number, // percentage
    muscleMass: Number,
    bmi: Number,
    bodyMeasurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
      thighs: Number,
      neck: Number
    }
  },
  
  photos: [{
    url: String,
    type: String (enum: ['front', 'side', 'back']),
    notes: String
  }],
  
  mood: String,
  energyLevel: Number (1-10),
  sleepQuality: Number (1-10),
  stressLevel: Number (1-10),
  
  notes: String,
  
  createdAt: Date
}
```

### 8. Workout Plans Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  level: String (enum: ['beginner', 'intermediate', 'advanced']),
  goal: String (enum: ['weight_loss', 'muscle_gain', 'strength', 'endurance']),
  duration: Number, // weeks
  
  schedule: [{
    week: Number,
    days: [{
      dayNumber: Number,
      name: String,
      type: String,
      exercises: [{
        exerciseId: ObjectId (ref: 'Exercise'),
        sets: Number,
        reps: String, // can be range like "8-12"
        weight: String, // percentage or fixed
        rest: Number, // seconds
        notes: String
      }],
      estimatedDuration: Number
    }]
  }],
  
  equipment: [String],
  tags: [String],
  
  rating: {
    average: Number,
    count: Number
  },
  
  createdBy: ObjectId (ref: 'User'),
  isPublic: Boolean,
  isPremium: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes for Performance

```javascript
// Users
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "createdAt": -1 })

// Workouts
db.workouts.createIndex({ "userId": 1, "date": -1 })
db.workouts.createIndex({ "userId": 1, "type": 1 })

// Exercises
db.exercises.createIndex({ "category": 1, "difficulty": 1 })
db.exercises.createIndex({ "muscleGroups": 1 })
db.exercises.createIndex({ "name": "text", "category": "text" })

// Nutrition
db.nutrition.createIndex({ "userId": 1, "date": -1 }, { unique: true })

// Food Database
db.foods.createIndex({ "name": "text", "brand": "text" })
db.foods.createIndex({ "barcode": 1 }, { sparse: true })

// Goals
db.goals.createIndex({ "userId": 1, "status": 1 })
db.goals.createIndex({ "userId": 1, "type": 1 })

// Progress
db.progress.createIndex({ "userId": 1, "date": -1 })

// Workout Plans
db.workoutPlans.createIndex({ "level": 1, "goal": 1 })
db.workoutPlans.createIndex({ "isPublic": 1, "rating.average": -1 })
```