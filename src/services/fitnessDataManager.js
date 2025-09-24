// Local storage management for fitness data
class FitnessDataManager {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize with sample data if not exists
    if (!localStorage.getItem('fitnessData')) {
      const initialData = {
        user: {
          id: 'user_1',
          name: 'Krishna Chodvadiya',
          email: 'krishna@example.com',
          profile: {
            age: 22,
            gender: 'male',
            height: 175, // cm
            weight: 73.5, // kg
            targetWeight: 70,
            activityLevel: 'moderately_active',
            fitnessGoals: ['weight_loss', 'muscle_gain', 'endurance'],
            dailyCalorieTarget: 2200,
            dailyWaterTarget: 8 // glasses
          },
          joinDate: new Date().toISOString(),
          preferences: {
            units: 'metric',
            theme: 'light',
            notifications: true
          }
        },
        workouts: [
          {
            id: 'w1',
            title: 'Upper Body Strength',
            date: new Date(Date.now() - 86400000).toISOString(),
            type: 'strength',
            duration: 60,
            exercises: [
              { name: 'Push-ups', sets: 3, reps: 12, weight: 0 },
              { name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
              { name: 'Bench Press', sets: 4, reps: 10, weight: 60 }
            ],
            caloriesBurned: 320,
            notes: 'Great session, felt strong'
          },
          {
            id: 'w2',
            title: 'Cardio Run',
            date: new Date(Date.now() - 172800000).toISOString(),
            type: 'cardio',
            duration: 30,
            exercises: [
              { name: 'Running', duration: 30, distance: 5, pace: '6:00' }
            ],
            caloriesBurned: 250,
            notes: 'Good pace maintained'
          },
          {
            id: 'w3',
            title: 'Lower Body Strength',
            date: new Date(Date.now() - 259200000).toISOString(),
            type: 'strength',
            duration: 55,
            exercises: [
              { name: 'Squats', sets: 4, reps: 12, weight: 80 },
              { name: 'Deadlifts', sets: 3, reps: 8, weight: 100 },
              { name: 'Lunges', sets: 3, reps: 10, weight: 20 }
            ],
            caloriesBurned: 310,
            notes: 'Legs feeling strong'
          }
        ],
        nutrition: [
          {
            id: 'n1',
            date: new Date().toISOString().split('T')[0],
            meals: [
              {
                type: 'breakfast',
                foods: [
                  { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fats: 3 },
                  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0 },
                  { name: 'Milk', calories: 80, protein: 8, carbs: 12, fats: 2 }
                ]
              },
              {
                type: 'lunch',
                foods: [
                  { name: 'Chicken Breast', calories: 231, protein: 43, carbs: 0, fats: 5 },
                  { name: 'Rice', calories: 205, protein: 4, carbs: 45, fats: 0 },
                  { name: 'Vegetables', calories: 50, protein: 2, carbs: 10, fats: 0 }
                ]
              },
              {
                type: 'dinner',
                foods: [
                  { name: 'Salmon', calories: 206, protein: 22, carbs: 0, fats: 12 },
                  { name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fats: 0 },
                  { name: 'Broccoli', calories: 25, protein: 3, carbs: 5, fats: 0 }
                ]
              }
            ],
            waterIntake: 6,
            totalCalories: 1164,
            totalProtein: 90,
            totalCarbs: 152,
            totalFats: 22
          }
        ],
        healthMetrics: [
          {
            id: 'hm1',
            date: new Date().toISOString().split('T')[0],
            weight: 73.5,
            steps: 8500,
            heartRate: { resting: 65, max: 185 },
            sleep: { hours: 7.5, quality: 'good' },
            mood: 'good',
            energy: 8
          },
          {
            id: 'hm2',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            weight: 73.7,
            steps: 10200,
            heartRate: { resting: 62, max: 180 },
            sleep: { hours: 8, quality: 'excellent' },
            mood: 'excellent',
            energy: 9
          }
        ],
        goals: [
          {
            id: 'g1',
            title: 'Lose 3.5kg',
            type: 'weight_loss',
            target: 70,
            current: 73.5,
            deadline: new Date(Date.now() + 90 * 86400000).toISOString(),
            progress: 0,
            active: true
          },
          {
            id: 'g2',
            title: 'Run 5K under 25 minutes',
            type: 'performance',
            target: 25,
            current: 30,
            deadline: new Date(Date.now() + 60 * 86400000).toISOString(),
            progress: 17,
            active: true
          },
          {
            id: 'g3',
            title: 'Workout 4 times per week',
            type: 'consistency',
            target: 16,
            current: 12,
            deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
            progress: 75,
            active: true
          }
        ],
        achievements: [
          {
            id: 'a1',
            title: 'First Workout',
            description: 'Complete your first workout session',
            icon: '🏋️',
            earned: true,
            earnedDate: new Date(Date.now() - 604800000).toISOString()
          },
          {
            id: 'a2',
            title: 'Consistency King',
            description: 'Work out 5 days in a row',
            icon: '👑',
            earned: true,
            earnedDate: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: 'a3',
            title: 'Calorie Crusher',
            description: 'Burn 500+ calories in a single workout',
            icon: '🔥',
            earned: false,
            target: 500,
            progress: 320
          }
        ],
        streaks: {
          workout: { current: 5, longest: 12 },
          nutrition: { current: 3, longest: 8 },
          water: { current: 2, longest: 15 }
        }
      };
      localStorage.setItem('fitnessData', JSON.stringify(initialData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem('fitnessData'));
  }

  saveData(data) {
    localStorage.setItem('fitnessData', JSON.stringify(data));
  }

  // User methods
  getUser() {
    return this.getData().user;
  }

  updateUser(userData) {
    const data = this.getData();
    data.user = { ...data.user, ...userData };
    this.saveData(data);
    return data.user;
  }

  // Workout methods
  getWorkouts() {
    return this.getData().workouts;
  }

  addWorkout(workout) {
    const data = this.getData();
    const newWorkout = {
      id: 'w' + Date.now(),
      ...workout,
      date: workout.date || new Date().toISOString()
    };
    data.workouts.unshift(newWorkout);
    this.saveData(data);
    return newWorkout;
  }

  updateWorkout(id, updates) {
    const data = this.getData();
    const index = data.workouts.findIndex(w => w.id === id);
    if (index !== -1) {
      data.workouts[index] = { ...data.workouts[index], ...updates };
      this.saveData(data);
      return data.workouts[index];
    }
    return null;
  }

  deleteWorkout(id) {
    const data = this.getData();
    data.workouts = data.workouts.filter(w => w.id !== id);
    this.saveData(data);
  }

  getWorkoutStats(days = 7) {
    const workouts = this.getWorkouts();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentWorkouts = workouts.filter(w => new Date(w.date) >= cutoffDate);
    
    return {
      totalWorkouts: recentWorkouts.length,
      totalDuration: recentWorkouts.reduce((sum, w) => sum + w.duration, 0),
      totalCalories: recentWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
      avgDuration: recentWorkouts.length > 0 ? Math.round(recentWorkouts.reduce((sum, w) => sum + w.duration, 0) / recentWorkouts.length) : 0,
      avgCalories: recentWorkouts.length > 0 ? Math.round(recentWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0) / recentWorkouts.length) : 0,
      workoutTypes: recentWorkouts.reduce((acc, w) => {
        acc[w.type] = (acc[w.type] || 0) + 1;
        return acc;
      }, {})
    };
  }

  // Nutrition methods
  getNutrition() {
    return this.getData().nutrition;
  }

  addNutritionEntry(entry) {
    const data = this.getData();
    const newEntry = {
      id: 'n' + Date.now(),
      ...entry,
      date: entry.date || new Date().toISOString().split('T')[0]
    };
    data.nutrition.unshift(newEntry);
    this.saveData(data);
    return newEntry;
  }

  updateNutritionEntry(id, updates) {
    const data = this.getData();
    const index = data.nutrition.findIndex(n => n.id === id);
    if (index !== -1) {
      data.nutrition[index] = { ...data.nutrition[index], ...updates };
      this.saveData(data);
      return data.nutrition[index];
    }
    return null;
  }

  getTodaysNutrition() {
    const today = new Date().toISOString().split('T')[0];
    return this.getNutrition().find(n => n.date === today) || {
      date: today,
      meals: [],
      waterIntake: 0,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0
    };
  }

  // Health metrics methods
  getHealthMetrics() {
    return this.getData().healthMetrics;
  }

  addHealthMetric(metric) {
    const data = this.getData();
    const newMetric = {
      id: 'hm' + Date.now(),
      ...metric,
      date: metric.date || new Date().toISOString().split('T')[0]
    };
    data.healthMetrics.unshift(newMetric);
    this.saveData(data);
    return newMetric;
  }

  getTodaysMetrics() {
    const today = new Date().toISOString().split('T')[0];
    return this.getHealthMetrics().find(m => m.date === today) || {
      date: today,
      weight: null,
      steps: 0,
      heartRate: { resting: null, max: null },
      sleep: { hours: null, quality: null },
      mood: null,
      energy: null
    };
  }

  // Get comprehensive health metrics with calculated values for HealthMetrics page
  getCurrentHealthMetrics() {
    const todaysMetrics = this.getTodaysMetrics();
    const workouts = this.getWorkouts();
    const user = this.getUser();
    
    // Calculate today's workout minutes
    const today = new Date().toISOString().split('T')[0];
    const todaysWorkouts = workouts.filter(w => w.date === today);
    const activeMinutes = todaysWorkouts.reduce((total, workout) => {
      return total + (workout.duration || 0);
    }, 0);

    // Calculate calories burned today
    const caloriesBurned = todaysWorkouts.reduce((total, workout) => {
      return total + (workout.caloriesBurned || 0);
    }, 0);

    return {
      ...todaysMetrics,
      steps: todaysMetrics.steps || 8500, // Use actual or default
      stepsGoal: 10000,
      activeMinutes: activeMinutes,
      activeMinutesGoal: 60,
      caloriesBurned: caloriesBurned,
      caloriesBurnedGoal: 500,
      weight: todaysMetrics.weight || user.weight,
      weightGoal: user.targetWeight
    };
  }

  // Goals methods
  getGoals() {
    return this.getData().goals;
  }

  addGoal(goal) {
    const data = this.getData();
    const newGoal = {
      id: 'g' + Date.now(),
      ...goal,
      progress: 0,
      active: true
    };
    data.goals.push(newGoal);
    this.saveData(data);
    return newGoal;
  }

  updateGoal(id, updates) {
    const data = this.getData();
    const index = data.goals.findIndex(g => g.id === id);
    if (index !== -1) {
      data.goals[index] = { ...data.goals[index], ...updates };
      this.saveData(data);
      return data.goals[index];
    }
    return null;
  }

  // Dashboard data
  getDashboardData() {
    const workoutStats = this.getWorkoutStats(7);
    const todaysNutrition = this.getTodaysNutrition();
    const todaysMetrics = this.getTodaysMetrics();
    const user = this.getUser();
    const goals = this.getGoals().filter(g => g.active);
    const streaks = this.getData().streaks;
    const recentWorkouts = this.getWorkouts().slice(0, 5);

    return {
      user,
      workoutStats,
      todaysNutrition,
      todaysMetrics,
      goals,
      streaks,
      recentWorkouts,
      summary: {
        totalWorkouts: this.getWorkouts().length,
        totalCaloriesBurned: this.getWorkouts().reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
        currentWeight: user.profile.weight,
        targetWeight: user.profile.targetWeight,
        dailyCalorieTarget: user.profile.dailyCalorieTarget,
        dailyWaterTarget: user.profile.dailyWaterTarget
      }
    };
  }

  // Progress tracking
  getProgressData(metric = 'weight', days = 30) {
    const healthMetrics = this.getHealthMetrics();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentMetrics = healthMetrics
      .filter(m => new Date(m.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    switch (metric) {
      case 'weight':
        return recentMetrics.map(m => ({
          date: m.date,
          value: m.weight
        })).filter(m => m.value !== null);
      case 'steps':
        return recentMetrics.map(m => ({
          date: m.date,
          value: m.steps
        }));
      case 'workouts':
        const workouts = this.getWorkouts();
        const workoutsByDate = {};
        workouts.forEach(w => {
          const date = w.date.split('T')[0];
          workoutsByDate[date] = (workoutsByDate[date] || 0) + 1;
        });
        return Object.entries(workoutsByDate).map(([date, count]) => ({
          date,
          value: count
        }));
      default:
        return [];
    }
  }

  // Achievements
  getAchievements() {
    return this.getData().achievements;
  }

  checkAndUnlockAchievements() {
    const data = this.getData();
    const workouts = data.workouts;
    const achievements = data.achievements;
    let newAchievements = [];

    // Check for Calorie Crusher achievement
    const calorieAchievement = achievements.find(a => a.id === 'a3');
    if (!calorieAchievement.earned) {
      const maxCalories = Math.max(...workouts.map(w => w.caloriesBurned || 0));
      if (maxCalories >= 500) {
        calorieAchievement.earned = true;
        calorieAchievement.earnedDate = new Date().toISOString();
        newAchievements.push(calorieAchievement);
      }
    }

    if (newAchievements.length > 0) {
      this.saveData(data);
    }

    return newAchievements;
  }

  // Get comprehensive progress data for Progress page
  getComprehensiveProgressData(timeRange = 'weekly') {
    const workouts = this.getWorkouts();
    const healthMetrics = this.getHealthMetrics();
    const user = this.getUser();
    
    const days = timeRange === 'weekly' ? 7 : timeRange === 'monthly' ? 30 : 365;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Recent workouts for streak calculation
    const recentWorkouts = workouts
      .filter(w => new Date(w.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate workout streak
    let workoutStreak = 0;
    let currentDate = new Date();
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasWorkout = workouts.some(w => w.date === dateStr);
      if (hasWorkout) {
        workoutStreak++;
      } else if (i > 0) {
        break;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Recent health metrics
    const recentHealthMetrics = healthMetrics
      .filter(m => new Date(m.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Generate data arrays for charts
    const generateDataArray = (days) => {
      const data = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Find workout for this date
        const dayWorkouts = workouts.filter(w => w.date === dateStr);
        const totalCalories = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
        
        // Find health metrics for this date
        const dayMetrics = healthMetrics.find(m => m.date === dateStr);
        
        data.push({
          date: dateStr,
          workouts: dayWorkouts.length,
          calories: totalCalories,
          weight: dayMetrics?.weight || user.weight,
          steps: dayMetrics?.steps || 0,
          sleep: dayMetrics?.sleepHours || 0
        });
      }
      return data;
    };

    const chartData = generateDataArray(days);

    return {
      weight: {
        current: user.weight,
        start: user.weight + 2, // Mock start weight
        goal: user.targetWeight,
        change: user.targetWeight - user.weight,
        data: chartData.map(d => d.weight)
      },
      steps: {
        current: healthMetrics[healthMetrics.length - 1]?.steps || 0,
        goal: 10000,
        average: Math.round(chartData.reduce((sum, d) => sum + d.steps, 0) / chartData.length),
        data: chartData.map(d => d.steps),
        streak: 5, // Mock streak
        bestStreak: 15
      },
      workouts: {
        thisWeek: recentWorkouts.filter(w => {
          const workoutDate = new Date(w.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return workoutDate >= weekAgo;
        }).length,
        lastWeek: 3, // Mock data
        streak: workoutStreak,
        bestStreak: Math.max(workoutStreak + 5, 15),
        total: workouts.length,
        data: chartData.map(d => d.workouts)
      },
      calories: {
        burned: chartData[chartData.length - 1]?.calories || 0,
        goal: 500,
        data: chartData.map(d => d.calories)
      },
      sleep: {
        average: Math.round((chartData.reduce((sum, d) => sum + d.sleep, 0) / chartData.length) * 10) / 10,
        goal: 8.0,
        quality: 85,
        data: chartData.map(d => d.sleep),
        streak: 3,
        bestStreak: 9
      }
    };
  }
}

export default new FitnessDataManager();