import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon, 
  PlusIcon,
  FireIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAI } from '../context/AIContext';
import toast from 'react-hot-toast';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const { generateWorkoutPlan, aiLoading } = useAI();

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  useEffect(() => {
    // Sample workouts
    const sampleWorkouts = [
      {
        id: 1,
        name: "Full Body Strength",
        duration: 45,
        exercises: [
          { name: "Push-ups", sets: 3, reps: 12, restTime: "60s" },
          { name: "Squats", sets: 3, reps: 15, restTime: "60s" },
          { name: "Lunges", sets: 3, reps: 10, restTime: "45s" },
          { name: "Plank", sets: 3, duration: "30s", restTime: "45s" }
        ],
        difficulty: "Intermediate",
        caloriesBurn: 350,
        category: "Strength"
      },
      {
        id: 2,
        name: "Cardio Blast",
        duration: 30,
        exercises: [
          { name: "Jumping Jacks", sets: 3, reps: 20, restTime: "30s" },
          { name: "Burpees", sets: 3, reps: 8, restTime: "45s" },
          { name: "Mountain Climbers", sets: 3, reps: 15, restTime: "30s" },
          { name: "High Knees", sets: 3, duration: "30s", restTime: "30s" }
        ],
        difficulty: "Beginner",
        caloriesBurn: 280,
        category: "Cardio"
      }
    ];
    setWorkouts(sampleWorkouts);

    // Sample completed workouts
    const sampleCompleted = [
      {
        id: 1,
        name: "Morning Jog",
        duration: 1800, // 30 minutes in seconds
        caloriesBurned: 250,
        completedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
      {
        id: 2,
        name: "Strength Training",
        duration: 2700, // 45 minutes
        caloriesBurned: 350,
        completedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      }
    ];
    setCompletedWorkouts(sampleCompleted);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = (workout) => {
    setActiveWorkout(workout);
    setTimer(0);
    setIsRunning(true);
    toast.success(`Started ${workout.name}`);
  };

  const pauseWorkout = () => {
    setIsRunning(false);
    toast.info('Workout paused');
  };

  const resumeWorkout = () => {
    setIsRunning(true);
    toast.success('Workout resumed');
  };

  const stopWorkout = () => {
    setIsRunning(false);
    if (activeWorkout) {
      const completedWorkout = {
        id: Date.now(),
        name: activeWorkout.name,
        duration: timer,
        caloriesBurned: Math.round((timer / 60) * (activeWorkout.caloriesBurn / activeWorkout.duration)),
        completedAt: new Date().toISOString()
      };
      
      setCompletedWorkouts(prev => [completedWorkout, ...prev]);
      toast.success(`Completed ${activeWorkout.name}! Duration: ${formatTime(timer)}`);
    }
    setActiveWorkout(null);
    setTimer(0);
  };

  const generateAIWorkout = async () => {
    try {
      const workoutPlan = await generateWorkoutPlan(
        { fitnessGoal: 'build_muscle', experience: 'beginner' },
        { duration: 45, equipment: 'bodyweight' }
      );
      setWorkouts(prev => [...prev, { ...workoutPlan, id: Date.now() }]);
      toast.success('AI workout plan generated!');
    } catch (error) {
      toast.error('Failed to generate workout plan');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'strength': return 'text-blue-600 bg-blue-100';
      case 'cardio': return 'text-red-600 bg-red-100';
      case 'flexibility': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
          <p className="text-gray-600">Track your exercises and build strength</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateAIWorkout}
            disabled={aiLoading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {aiLoading ? 'Generating...' : '✨ AI Workout'}
          </button>
          <button
            onClick={() => setShowNewWorkout(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Workout</span>
          </button>
        </div>
      </div>

      {/* Active Workout Timer */}
      {activeWorkout && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{activeWorkout.name}</h3>
              <p className="text-blue-100">Workout in progress</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatTime(timer)}</div>
              <div className="flex space-x-2 mt-2">
                {isRunning ? (
                  <button
                    onClick={pauseWorkout}
                    className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <PauseIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={resumeWorkout}
                    className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <PlayIcon className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={stopWorkout}
                  className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <StopIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Current Exercise Progress */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex justify-between items-center">
              <span className="text-blue-100">Next: {activeWorkout.exercises[0]?.name}</span>
              <span className="text-white font-medium">
                {activeWorkout.exercises[0]?.sets && `${activeWorkout.exercises[0].sets} sets`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{completedWorkouts.length}</p>
              <p className="text-sm text-gray-500">Workouts completed</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(completedWorkouts.reduce((acc, w) => acc + w.duration, 0) / 60)}
              </p>
              <p className="text-sm text-gray-500">Minutes this week</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calories Burned</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0)}
              </p>
              <p className="text-sm text-gray-500">This week</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FireIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Workout Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{workout.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(workout.category)}`}>
                    {workout.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FireIcon className="h-4 w-4" />
                    <span>{workout.caloriesBurn} cal</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {workout.exercises.slice(0, 3).map((exercise, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{exercise.name}</span>
                  <span className="text-gray-500">
                    {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                    {exercise.sets && exercise.duration && `${exercise.sets}x${exercise.duration}`}
                  </span>
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <p className="text-xs text-gray-500">+{workout.exercises.length - 3} more exercises</p>
              )}
            </div>

            <button
              onClick={() => startWorkout(workout)}
              disabled={activeWorkout !== null}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <PlayIcon className="h-4 w-4" />
              <span>{activeWorkout ? 'Workout Active' : 'Start Workout'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Recent Completions */}
      {completedWorkouts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completions</h3>
          <div className="space-y-3">
            {completedWorkouts.slice(0, 5).map((workout, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{workout.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(workout.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatTime(workout.duration)}</p>
                  <p className="text-sm text-gray-600">{workout.caloriesBurned} cal burned</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;