# React Component Architecture for Fitness Tracking Application

## Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── common/                # Generic components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Loading/
│   │   ├── ErrorBoundary/
│   │   └── Layout/
│   ├── charts/                # Chart components
│   │   ├── LineChart/
│   │   ├── BarChart/
│   │   ├── PieChart/
│   │   ├── ProgressChart/
│   │   └── CalendarHeatmap/
│   ├── forms/                 # Form components
│   │   ├── WorkoutForm/
│   │   ├── NutritionForm/
│   │   ├── ProfileForm/
│   │   └── GoalForm/
│   └── ui/                    # UI-specific components
│       ├── Card/
│       ├── Badge/
│       ├── Avatar/
│       ├── Tabs/
│       └── DatePicker/
├── pages/                     # Route components
│   ├── auth/
│   │   ├── Login/
│   │   ├── Register/
│   │   └── ForgotPassword/
│   ├── dashboard/
│   │   └── Dashboard/
│   ├── workouts/
│   │   ├── WorkoutList/
│   │   ├── WorkoutDetail/
│   │   ├── WorkoutLogger/
│   │   └── WorkoutPlans/
│   ├── nutrition/
│   │   ├── NutritionDiary/
│   │   ├── FoodSearch/
│   │   └── NutritionGoals/
│   ├── progress/
│   │   ├── ProgressTracker/
│   │   ├── ProgressCharts/
│   │   └── ProgressPhotos/
│   ├── exercises/
│   │   ├── ExerciseLibrary/
│   │   └── ExerciseDetail/
│   ├── goals/
│   │   ├── GoalsList/
│   │   └── GoalDetail/
│   └── profile/
│       ├── Profile/
│       └── Settings/
├── hooks/                     # Custom hooks
│   ├── useAuth.js
│   ├── useApi.js
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   ├── useInfiniteScroll.js
│   ├── useWorkout.js
│   ├── useNutrition.js
│   └── useProgress.js
├── context/                   # Context providers
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   ├── WorkoutContext.jsx
│   └── NotificationContext.jsx
├── services/                  # API services
│   ├── api.js
│   ├── authService.js
│   ├── workoutService.js
│   ├── nutritionService.js
│   ├── progressService.js
│   └── uploadService.js
├── utils/                     # Utility functions
│   ├── helpers.js
│   ├── validators.js
│   ├── formatters.js
│   ├── calculations.js
│   └── constants.js
├── assets/                    # Static assets
│   ├── images/
│   ├── icons/
│   └── videos/
└── styles/                    # Global styles
    ├── globals.css
    ├── variables.css
    └── components.css
```

## Core Page Components

### 1. Dashboard Component
```jsx
// pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  StatsOverview, 
  RecentWorkouts, 
  NutritionSummary, 
  ProgressChart, 
  QuickActions,
  UpcomingGoals 
} from './components';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Your Fitness Dashboard</h1>
        <TimeframeSelector 
          value={timeframe} 
          onChange={setTimeframe} 
        />
      </header>

      <div className="dashboard-grid">
        <section className="stats-section">
          <StatsOverview timeframe={timeframe} />
        </section>

        <section className="quick-actions">
          <QuickActions />
        </section>

        <section className="recent-activity">
          <RecentWorkouts limit={5} />
        </section>

        <section className="nutrition-overview">
          <NutritionSummary date={new Date()} />
        </section>

        <section className="progress-chart">
          <ProgressChart 
            metric="weight" 
            timeframe={timeframe} 
          />
        </section>

        <section className="goals-section">
          <UpcomingGoals />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
```

### 2. Workout Logger Component
```jsx
// pages/workouts/WorkoutLogger.jsx
import React, { useState, useEffect } from 'react';
import { ExerciseSelector, SetTracker, TimerDisplay } from './components';

const WorkoutLogger = () => {
  const [workout, setWorkout] = useState({
    name: '',
    exercises: [],
    startTime: null,
    duration: 0
  });
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const addExercise = (exercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        ...exercise,
        sets: []
      }]
    }));
  };

  const addSet = (exerciseIndex, setData) => {
    setWorkout(prev => {
      const updated = { ...prev };
      updated.exercises[exerciseIndex].sets.push(setData);
      return updated;
    });
  };

  return (
    <div className="workout-logger">
      <header className="logger-header">
        <TimerDisplay 
          startTime={workout.startTime}
          isActive={isActive}
        />
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`btn ${isActive ? 'btn-pause' : 'btn-start'}`}
        >
          {isActive ? 'Pause' : 'Start'} Workout
        </button>
      </header>

      <div className="logger-content">
        <ExerciseSelector 
          onSelect={addExercise}
          excludeSelected={workout.exercises.map(e => e.id)}
        />

        <div className="exercise-list">
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onAddSet={(setData) => addSet(index, setData)}
              isActive={currentExercise === index}
              onClick={() => setCurrentExercise(index)}
            />
          ))}
        </div>
      </div>

      <footer className="logger-footer">
        <button 
          onClick={saveWorkout}
          className="btn btn-primary btn-large"
          disabled={workout.exercises.length === 0}
        >
          Complete Workout
        </button>
      </footer>
    </div>
  );
};
```

### 3. Nutrition Diary Component
```jsx
// pages/nutrition/NutritionDiary.jsx
import React, { useState, useEffect } from 'react';
import { MealCard, NutritionGoals, MacroBreakdown } from './components';

const NutritionDiary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nutritionData, setNutritionData] = useState(null);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [activeMeal, setActiveMeal] = useState(null);

  const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];

  const addFood = (mealType, food) => {
    // Add food to specific meal
    setNutritionData(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: [...(prev.meals[mealType] || []), food]
      }
    }));
  };

  return (
    <div className="nutrition-diary">
      <header className="diary-header">
        <DatePicker 
          value={selectedDate}
          onChange={setSelectedDate}
        />
        <NutritionGoals 
          current={nutritionData?.totals}
          goals={nutritionData?.goals}
        />
      </header>

      <div className="macro-overview">
        <MacroBreakdown 
          macros={nutritionData?.totals?.macros}
          goals={nutritionData?.goals?.macros}
        />
      </div>

      <div className="meals-section">
        {meals.map(mealType => (
          <MealCard
            key={mealType}
            mealType={mealType}
            foods={nutritionData?.meals?.[mealType] || []}
            onAddFood={() => {
              setActiveMeal(mealType);
              setShowFoodSearch(true);
            }}
            onRemoveFood={(foodIndex) => removeFood(mealType, foodIndex)}
          />
        ))}
      </div>

      {showFoodSearch && (
        <FoodSearchModal
          onClose={() => setShowFoodSearch(false)}
          onSelect={(food) => {
            addFood(activeMeal, food);
            setShowFoodSearch(false);
          }}
        />
      )}
    </div>
  );
};
```

### 4. Progress Tracker Component
```jsx
// pages/progress/ProgressTracker.jsx
import React, { useState, useEffect } from 'react';
import { WeightChart, MeasurementsForm, ProgressPhotos } from './components';

const ProgressTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState(null);
  const [showAddEntry, setShowAddEntry] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'weight', label: 'Weight' },
    { id: 'measurements', label: 'Measurements' },
    { id: 'photos', label: 'Progress Photos' },
    { id: 'goals', label: 'Goals' }
  ];

  return (
    <div className="progress-tracker">
      <header className="tracker-header">
        <h1>Progress Tracking</h1>
        <button 
          onClick={() => setShowAddEntry(true)}
          className="btn btn-primary"
        >
          Add Entry
        </button>
      </header>

      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <ProgressOverview data={progressData} />
        )}
        
        {activeTab === 'weight' && (
          <WeightChart 
            data={progressData?.weight}
            timeframe="3months"
          />
        )}
        
        {activeTab === 'measurements' && (
          <MeasurementsChart 
            data={progressData?.measurements}
          />
        )}
        
        {activeTab === 'photos' && (
          <ProgressPhotos 
            photos={progressData?.photos}
            onUpload={uploadProgressPhoto}
          />
        )}
      </div>

      {showAddEntry && (
        <ProgressEntryModal
          onClose={() => setShowAddEntry(false)}
          onSave={saveProgressEntry}
        />
      )}
    </div>
  );
};
```

## Reusable Components

### 1. Chart Components
```jsx
// components/charts/LineChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = ({ 
  data, 
  options = {}, 
  height = 300,
  title,
  loading = false 
}) => {
  if (loading) {
    return <ChartSkeleton height={height} />;
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    ...options
  };

  return (
    <div className="chart-container" style={{ height }}>
      {title && <h3 className="chart-title">{title}</h3>}
      <Line data={data} options={defaultOptions} />
    </div>
  );
};

export default LineChart;
```

### 2. Form Components
```jsx
// components/forms/WorkoutForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExerciseSelector, SetInput } from './components';

const WorkoutForm = ({ initialData = null, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  const [exercises, setExercises] = useState(initialData?.exercises || []);

  const addExercise = (exercise) => {
    setExercises(prev => [...prev, {
      ...exercise,
      sets: [{ reps: '', weight: '', rest: 60 }]
    }]);
  };

  const updateExercise = (index, updates) => {
    setExercises(prev => 
      prev.map((ex, i) => i === index ? { ...ex, ...updates } : ex)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="workout-form">
      <div className="form-section">
        <Input
          label="Workout Name"
          {...register('name', { required: 'Workout name is required' })}
          error={errors.name?.message}
        />
        
        <Select
          label="Workout Type"
          {...register('type', { required: true })}
          options={[
            { value: 'strength', label: 'Strength Training' },
            { value: 'cardio', label: 'Cardio' },
            { value: 'flexibility', label: 'Flexibility' },
          ]}
        />
      </div>

      <div className="exercises-section">
        <h3>Exercises</h3>
        <ExerciseSelector onSelect={addExercise} />
        
        {exercises.map((exercise, index) => (
          <ExerciseFormCard
            key={exercise.id}
            exercise={exercise}
            onUpdate={(updates) => updateExercise(index, updates)}
            onRemove={() => removeExercise(index)}
          />
        ))}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Workout
        </button>
      </div>
    </form>
  );
};
```

## Custom Hooks

### 1. Workout Hook
```jsx
// hooks/useWorkout.js
import { useState, useEffect, useCallback } from 'react';
import { workoutService } from '../services/workoutService';

export const useWorkout = (workoutId = null) => {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkout = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await workoutService.getWorkout(id);
      setWorkout(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveWorkout = useCallback(async (workoutData) => {
    setLoading(true);
    try {
      const savedWorkout = workout?.id 
        ? await workoutService.updateWorkout(workout.id, workoutData)
        : await workoutService.createWorkout(workoutData);
      
      setWorkout(savedWorkout);
      return savedWorkout;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workout?.id]);

  const deleteWorkout = useCallback(async (id) => {
    try {
      await workoutService.deleteWorkout(id);
      setWorkout(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (workoutId) {
      fetchWorkout(workoutId);
    }
  }, [workoutId, fetchWorkout]);

  return {
    workout,
    loading,
    error,
    saveWorkout,
    deleteWorkout,
    refetch: () => fetchWorkout(workoutId)
  };
};
```

### 2. API Hook
```jsx
// hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, execute, refetch: execute };
};
```

## State Management Strategy

### Context Providers
```jsx
// context/AppProvider.jsx
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';

export const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
```

This architecture provides:
- **Modularity**: Each feature has its own component structure
- **Reusability**: Common components can be shared across features
- **Scalability**: Easy to add new features without breaking existing code
- **Maintainability**: Clear separation of concerns and consistent patterns
- **Performance**: Optimized with proper state management and lazy loading