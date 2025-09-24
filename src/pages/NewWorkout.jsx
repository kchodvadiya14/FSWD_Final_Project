import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService, exerciseService } from '../services/fitnessService';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  XMarkIcon,
  ClockIcon,
  FireIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const NewWorkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [categories, setCategories] = useState({ categories: [], equipment: [] });

  const [workoutData, setWorkoutData] = useState({
    title: '',
    description: '',
    workoutType: 'strength',
    date: new Date().toISOString().split('T')[0],
    exercises: []
  });

  useEffect(() => {
    fetchExerciseLibrary();
    fetchCategories();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [workoutData.exercises]);

  const fetchExerciseLibrary = async () => {
    try {
      const data = await exerciseService.getExercises({ limit: 100 });
      setExerciseLibrary(data.data || []);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      // Try to seed exercises if none exist
      try {
        await exerciseService.seedExercises();
        const data = await exerciseService.getExercises({ limit: 100 });
        setExerciseLibrary(data.data || []);
      } catch (seedError) {
        console.error('Failed to seed exercises:', seedError);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await exerciseService.getCategories();
      setCategories(data.data || { categories: [], equipment: [] });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const calculateTotals = () => {
    const totalDuration = workoutData.exercises.reduce((sum, ex) => sum + (ex.duration?.value || 0), 0);
    const totalCalories = workoutData.exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
    
    setWorkoutData(prev => ({
      ...prev,
      duration: { value: totalDuration, unit: 'minutes' },
      caloriesBurned: totalCalories
    }));
  };

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
      
      // Format data to match backend validation requirements
      const formattedWorkoutData = {
        ...workoutData,
        totalDuration: workoutData.duration, // Backend expects 'totalDuration' not 'duration'
        exercises: workoutData.exercises.map(exercise => ({
          ...exercise,
          // Ensure category is valid
          category: ['cardio', 'strength', 'flexibility', 'sports', 'other'].includes(exercise.category) 
            ? exercise.category 
            : 'other'
        }))
      };
      
      console.log('Sending workout data:', formattedWorkoutData); // Debug log
      await workoutService.createWorkout(formattedWorkoutData);
      toast.success('Workout created successfully!');
      navigate('/workouts');
    } catch (error) {
      console.error('Failed to create workout:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exerciseLibrary.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.primaryMuscles.some(muscle => 
      muscle.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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