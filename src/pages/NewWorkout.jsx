import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fitnessDataManager from '../services/fitnessDataManager';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  XMarkIcon,
  ClockIcon,
  FireIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Predefined exercise library as fallback
const PREDEFINED_EXERCISES = [
  // Chest Exercises
  { _id: '1', name: 'Push-ups', category: 'chest', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['shoulders', 'core'], caloriesPerMinute: 8 },
  { _id: '2', name: 'Bench Press', category: 'chest', equipment: 'barbell', difficulty: 'intermediate', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['shoulders'], caloriesPerMinute: 10 },
  { _id: '3', name: 'Incline Dumbbell Press', category: 'chest', equipment: 'dumbbells', difficulty: 'intermediate', primaryMuscles: ['upper chest', 'triceps'], secondaryMuscles: ['shoulders'], caloriesPerMinute: 9 },
  { _id: '4', name: 'Chest Dips', category: 'chest', equipment: 'bodyweight', difficulty: 'intermediate', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['shoulders'], caloriesPerMinute: 7 },
  { _id: '5', name: 'Chest Flyes', category: 'chest', equipment: 'dumbbells', difficulty: 'beginner', primaryMuscles: ['chest'], secondaryMuscles: ['shoulders'], caloriesPerMinute: 6 },

  // Back Exercises
  { _id: '6', name: 'Pull-ups', category: 'back', equipment: 'bodyweight', difficulty: 'intermediate', primaryMuscles: ['lats', 'biceps'], secondaryMuscles: ['rhomboids', 'rear delts'], caloriesPerMinute: 10 },
  { _id: '7', name: 'Deadlift', category: 'back', equipment: 'barbell', difficulty: 'intermediate', primaryMuscles: ['hamstrings', 'glutes', 'lower back'], secondaryMuscles: ['traps', 'lats'], caloriesPerMinute: 12 },
  { _id: '8', name: 'Bent Over Rows', category: 'back', equipment: 'barbell', difficulty: 'intermediate', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['biceps', 'rear delts'], caloriesPerMinute: 9 },
  { _id: '9', name: 'Lat Pulldown', category: 'back', equipment: 'machine', difficulty: 'beginner', primaryMuscles: ['lats', 'biceps'], secondaryMuscles: ['rhomboids'], caloriesPerMinute: 8 },
  { _id: '10', name: 'T-Bar Row', category: 'back', equipment: 'barbell', difficulty: 'intermediate', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['biceps'], caloriesPerMinute: 9 },

  // Legs Exercises
  { _id: '11', name: 'Squats', category: 'legs', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['quadriceps', 'glutes'], secondaryMuscles: ['hamstrings', 'calves'], caloriesPerMinute: 8 },
  { _id: '12', name: 'Barbell Back Squat', category: 'legs', equipment: 'barbell', difficulty: 'intermediate', primaryMuscles: ['quadriceps', 'glutes'], secondaryMuscles: ['hamstrings', 'core'], caloriesPerMinute: 11 },
  { _id: '13', name: 'Lunges', category: 'legs', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['quadriceps', 'glutes'], secondaryMuscles: ['hamstrings', 'calves'], caloriesPerMinute: 7 },
  { _id: '14', name: 'Leg Press', category: 'legs', equipment: 'machine', difficulty: 'beginner', primaryMuscles: ['quadriceps', 'glutes'], secondaryMuscles: ['hamstrings'], caloriesPerMinute: 9 },
  { _id: '15', name: 'Calf Raises', category: 'legs', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['calves'], secondaryMuscles: [], caloriesPerMinute: 5 },

  // Shoulder Exercises
  { _id: '16', name: 'Shoulder Press', category: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner', primaryMuscles: ['shoulders'], secondaryMuscles: ['triceps', 'core'], caloriesPerMinute: 8 },
  { _id: '17', name: 'Lateral Raises', category: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner', primaryMuscles: ['side delts'], secondaryMuscles: [], caloriesPerMinute: 6 },
  { _id: '18', name: 'Front Raises', category: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner', primaryMuscles: ['front delts'], secondaryMuscles: [], caloriesPerMinute: 6 },
  { _id: '19', name: 'Reverse Flyes', category: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner', primaryMuscles: ['rear delts'], secondaryMuscles: ['rhomboids'], caloriesPerMinute: 6 },
  { _id: '20', name: 'Pike Push-ups', category: 'shoulders', equipment: 'bodyweight', difficulty: 'intermediate', primaryMuscles: ['shoulders'], secondaryMuscles: ['triceps', 'core'], caloriesPerMinute: 7 },

  // Arms Exercises
  { _id: '21', name: 'Bicep Curls', category: 'arms', equipment: 'dumbbells', difficulty: 'beginner', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], caloriesPerMinute: 5 },
  { _id: '22', name: 'Tricep Dips', category: 'arms', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['triceps'], secondaryMuscles: ['shoulders'], caloriesPerMinute: 6 },
  { _id: '23', name: 'Hammer Curls', category: 'arms', equipment: 'dumbbells', difficulty: 'beginner', primaryMuscles: ['biceps', 'forearms'], secondaryMuscles: [], caloriesPerMinute: 5 },
  { _id: '24', name: 'Tricep Extensions', category: 'arms', equipment: 'dumbbells', difficulty: 'beginner', primaryMuscles: ['triceps'], secondaryMuscles: [], caloriesPerMinute: 5 },
  { _id: '25', name: 'Close-Grip Push-ups', category: 'arms', equipment: 'bodyweight', difficulty: 'intermediate', primaryMuscles: ['triceps'], secondaryMuscles: ['chest', 'shoulders'], caloriesPerMinute: 7 },

  // Core Exercises
  { _id: '26', name: 'Plank', category: 'core', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['core'], secondaryMuscles: ['shoulders', 'glutes'], caloriesPerMinute: 4 },
  { _id: '27', name: 'Crunches', category: 'core', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['abs'], secondaryMuscles: [], caloriesPerMinute: 5 },
  { _id: '28', name: 'Russian Twists', category: 'core', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['obliques'], secondaryMuscles: ['abs'], caloriesPerMinute: 6 },
  { _id: '29', name: 'Mountain Climbers', category: 'core', equipment: 'bodyweight', difficulty: 'intermediate', primaryMuscles: ['core'], secondaryMuscles: ['shoulders', 'legs'], caloriesPerMinute: 10 },
  { _id: '30', name: 'Dead Bug', category: 'core', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['core'], secondaryMuscles: [], caloriesPerMinute: 4 },

  // Cardio Exercises
  { _id: '31', name: 'Jumping Jacks', category: 'cardio', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['full body'], secondaryMuscles: [], caloriesPerMinute: 12 },
  { _id: '32', name: 'Burpees', category: 'cardio', equipment: 'bodyweight', difficulty: 'intermediate', primaryMuscles: ['full body'], secondaryMuscles: [], caloriesPerMinute: 15 },
  { _id: '33', name: 'High Knees', category: 'cardio', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['legs', 'core'], secondaryMuscles: [], caloriesPerMinute: 10 },
  { _id: '34', name: 'Running', category: 'cardio', equipment: 'bodyweight', difficulty: 'beginner', primaryMuscles: ['legs'], secondaryMuscles: ['core'], caloriesPerMinute: 12 },
  { _id: '35', name: 'Jump Rope', category: 'cardio', equipment: 'other', difficulty: 'beginner', primaryMuscles: ['legs', 'shoulders'], secondaryMuscles: ['core'], caloriesPerMinute: 13 },

  // Full Body Exercises
  { _id: '36', name: 'Thrusters', category: 'full-body', equipment: 'dumbbells', difficulty: 'intermediate', primaryMuscles: ['legs', 'shoulders'], secondaryMuscles: ['core', 'triceps'], caloriesPerMinute: 12 },
  { _id: '37', name: 'Turkish Get-ups', category: 'full-body', equipment: 'dumbbells', difficulty: 'advanced', primaryMuscles: ['core', 'shoulders'], secondaryMuscles: ['legs', 'glutes'], caloriesPerMinute: 10 },
  { _id: '38', name: 'Bear Crawl', category: 'full-body', equipment: 'bodyweight', difficulty: 'intermediate', primaryMuscles: ['core', 'shoulders'], secondaryMuscles: ['legs'], caloriesPerMinute: 8 },
  { _id: '39', name: 'Clean and Press', category: 'full-body', equipment: 'dumbbells', difficulty: 'advanced', primaryMuscles: ['full body'], secondaryMuscles: [], caloriesPerMinute: 14 },
  { _id: '40', name: 'Man Makers', category: 'full-body', equipment: 'dumbbells', difficulty: 'advanced', primaryMuscles: ['full body'], secondaryMuscles: [], caloriesPerMinute: 15 }
];

const NewWorkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [workoutData, setWorkoutData] = useState({
    title: '',
    description: '',
    workoutType: 'strength',
    date: new Date().toISOString().split('T')[0],
    exercises: []
  });
  const fetchExerciseLibrary = React.useCallback(async () => {
    try {
      const data = await exerciseService.getExercises({ limit: 100 });
      setExerciseLibrary(data.data || PREDEFINED_EXERCISES);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      // Use predefined exercises as fallback
      setExerciseLibrary(PREDEFINED_EXERCISES);
      // Try to seed exercises if none exist
      try {
        await exerciseService.seedExercises();
        const data = await exerciseService.getExercises({ limit: 100 });
        if (data.data && data.data.length > 0) {
          setExerciseLibrary(data.data);
        }
      } catch (seedError) {
        console.error('Failed to seed exercises:', seedError);
      }
    }
  }, []);

  const calculateTotals = React.useCallback(() => {
    const totalDuration = workoutData.exercises.reduce((sum, ex) => sum + (ex.duration?.value || 0), 0);
    const totalCalories = workoutData.exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
    
    setWorkoutData(prev => ({
      ...prev,
      duration: { value: totalDuration, unit: 'minutes' },
      caloriesBurned: totalCalories
    }));
  }, [workoutData.exercises]);

  useEffect(() => {
    fetchExerciseLibrary();
  }, [fetchExerciseLibrary]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const addExerciseToWorkout = (exercise) => {
    // Map exercise categories to workout categories
    const categoryMapping = {
      'chest': 'strength',
      'legs': 'strength', 
      'back': 'strength',
      'shoulders': 'strength',
      'arms': 'strength',
      'core': 'strength',
      'cardio': 'cardio',
      'running': 'cardio',
      'cycling': 'cardio',
      'swimming': 'cardio',
      'flexibility': 'flexibility',
      'yoga': 'flexibility',
      'stretching': 'flexibility'
    };

    const newExercise = {
      name: exercise.name,
      category: categoryMapping[exercise.category] || 'strength', // Default to strength
      duration: { value: 30, unit: 'minutes' },
      sets: 3,
      reps: 10,
      weight: { value: 0, unit: 'kg' },
      caloriesBurned: exercise.caloriesPerMinute * 30 || 150,
      notes: ''
    };

    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
    setShowExerciseModal(false);
  };

  const removeExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const updateExercise = (index, field, value) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const updateExerciseNested = (index, field, subfield, value) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: { ...ex[field], [subfield]: value } } : ex
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!workoutData.title.trim()) {
      toast.error('Please enter a workout title');
      return;
    }

    if (workoutData.exercises.length === 0) {
      toast.error('Please add at least one exercise');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate total calories burned from all exercises
      const totalCaloriesBurned = workoutData.exercises.reduce((total, exercise) => {
        // Simple calorie calculation based on exercise type and duration
        const baseCaloriesPerMinute = {
          'cardio': 8,
          'strength': 6,
          'flexibility': 3,
          'sports': 7,
          'other': 5
        };
        
        const exerciseDuration = exercise.sets?.reduce((total, set) => {
          return total + (set.duration || 2); // Default 2 minutes per set if no duration
        }, 0) || 15; // Default 15 minutes if no sets
        
        return total + (baseCaloriesPerMinute[exercise.category] || 5) * exerciseDuration;
      }, 0);

      // Format workout data for local storage
      const formattedWorkoutData = {
        title: workoutData.title.trim(),
        date: workoutData.date,
        workoutType: workoutData.workoutType,
        duration: workoutData.duration,
        notes: workoutData.notes || '',
        exercises: workoutData.exercises.map(exercise => ({
          ...exercise,
          category: ['cardio', 'strength', 'flexibility', 'sports', 'other'].includes(exercise.category) 
            ? exercise.category 
            : 'other'
        })),
        caloriesBurned: Math.round(totalCaloriesBurned)
      };
      
      console.log('🚀 Creating workout with local data manager:', formattedWorkoutData);
      
      // Save workout using local data manager
      const result = fitnessDataManager.addWorkout(formattedWorkoutData);
      console.log('✅ Workout created successfully:', result);
      
      toast.success('Workout created successfully!');
      navigate('/workouts');
    } catch (error) {
      console.error('❌ Failed to create workout:', error);
      toast.error('Failed to create workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exerciseLibrary.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.primaryMuscles.some(muscle => 
        muscle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const exerciseCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'legs', label: 'Legs' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'arms', label: 'Arms' },
    { value: 'core', label: 'Core' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'full-body', label: 'Full Body' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Workout</h1>
        <p className="text-gray-600">Design your workout session</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Workout Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={workoutData.title}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Morning Cardio Session"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={workoutData.date}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Type
              </label>
              <select
                value={workoutData.workoutType}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, workoutType: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="strength">Strength Training</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="sports">Sports</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={workoutData.description}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your workout..."
              />
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Exercises</h2>
            <button
              type="button"
              onClick={() => setShowExerciseModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Exercise
            </button>
          </div>

          {workoutData.exercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No exercises added yet. Click "Add Exercise" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workoutData.exercises.map((exercise, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.duration?.value || ''}
                        onChange={(e) => updateExerciseNested(index, 'duration', 'value', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets || ''}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps || ''}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight?.value || ''}
                        onChange={(e) => updateExerciseNested(index, 'weight', 'value', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={exercise.notes || ''}
                      onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Add any notes..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {workoutData.exercises.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Workout Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Total Duration: <strong>{workoutData.duration?.value || 0} minutes</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FireIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Estimated Calories: <strong>{workoutData.caloriesBurned || 0}</strong>
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Total Exercises: <strong>{workoutData.exercises.length}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Workout'}
          </button>
        </div>
      </form>

      {/* Exercise Selection Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Select Exercise</h3>
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {exerciseCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              {filteredExercises.length === 0 ? (
                <p className="text-center text-gray-500">No exercises found.</p>
              ) : (
                <div className="grid gap-3">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise._id}
                      onClick={() => addExerciseToWorkout(exercise)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {exercise.category} • {exercise.equipment}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exercise.primaryMuscles?.map((muscle, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded"
                              >
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 capitalize">
                          {exercise.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewWorkout;