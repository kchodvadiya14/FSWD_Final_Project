import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { workoutService } from '../services/fitnessService';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  ClockIcon,
  FireIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkout = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching workout with ID:', id);
      const response = await workoutService.getWorkout(id);
      console.log('📦 Workout response:', response);
      
      const workoutData = response.data?.workout || response.workout || response.data || response;
      console.log('✅ Extracted workout:', workoutData);
      
      setWorkout(workoutData);
    } catch (error) {
      console.error('❌ Failed to fetch workout:', error);
      toast.error('Failed to load workout details');
      navigate('/workouts');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchWorkout();
  }, [fetchWorkout]);

  const handleDeleteWorkout = async () => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await workoutService.deleteWorkout(id);
      toast.success('Workout deleted successfully');
      navigate('/workouts');
    } catch (error) {
      console.error('Failed to delete workout:', error);
      toast.error('Failed to delete workout');
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWorkoutTypeColor = (type) => {
    const colors = {
      strength: 'bg-red-100 text-red-800 border-red-200',
      cardio: 'bg-blue-100 text-blue-800 border-blue-200',
      flexibility: 'bg-green-100 text-green-800 border-green-200',
      sports: 'bg-purple-100 text-purple-800 border-purple-200',
      mixed: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Workout Not Found</h2>
        <p className="text-gray-600 mb-6">The workout you're looking for doesn't exist.</p>
        <Link
          to="/workouts"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Back to Workouts
        </Link>
      </div>
    );
  }

  const totalDuration = workout.totalDuration?.value || workout.duration?.value || workout.durationInMinutes || 0;
  const totalCalories = workout.totalCaloriesBurned || workout.caloriesBurned || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/workouts')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workout.title}</h1>
            <p className="text-gray-600">Workout Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700">
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDeleteWorkout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Workout Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Workout Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{formatDate(workout.date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{formatDuration(totalDuration)}</span>
              </div>
              <div className="flex items-center gap-3">
                <FireIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{totalCalories} calories burned</span>
              </div>
              {workout.location && (
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 capitalize">{workout.location}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Categories & Rating</h2>
            <div className="space-y-3">
              <div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getWorkoutTypeColor(workout.workoutType)}`}>
                  {workout.workoutType}
                </span>
              </div>
              {workout.difficulty && (
                <div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                </div>
              )}
              {workout.rating && (
                <div className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-gray-900">{workout.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {workout.description && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{workout.description}</p>
          </div>
        )}
      </div>

      {/* Exercises */}
      {workout.exercises && workout.exercises.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Exercises ({workout.exercises.length})</h2>
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{exercise.category}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {exercise.caloriesBurned && <span>{exercise.caloriesBurned} cal</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {exercise.duration && (
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">{exercise.duration.value} {exercise.duration.unit || 'min'}</p>
                    </div>
                  )}
                  {exercise.sets && (
                    <div>
                      <span className="text-gray-600">Sets:</span>
                      <p className="font-medium">{exercise.sets}</p>
                    </div>
                  )}
                  {exercise.reps && (
                    <div>
                      <span className="text-gray-600">Reps:</span>
                      <p className="font-medium">{exercise.reps}</p>
                    </div>
                  )}
                  {exercise.weight?.value && (
                    <div>
                      <span className="text-gray-600">Weight:</span>
                      <p className="font-medium">{exercise.weight.value} {exercise.weight.unit || 'kg'}</p>
                    </div>
                  )}
                </div>

                {exercise.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Notes:</span>
                    <p className="text-sm text-gray-800 mt-1">{exercise.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout Notes */}
      {workout.notes && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Workout Notes</h2>
          <p className="text-gray-600">{workout.notes}</p>
        </div>
      )}

      {/* Mood Tracking */}
      {(workout.mood?.before || workout.mood?.after) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Mood Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workout.mood.before && (
              <div>
                <span className="text-sm text-gray-600">Before Workout:</span>
                <p className="font-medium capitalize">{workout.mood.before}</p>
              </div>
            )}
            {workout.mood.after && (
              <div>
                <span className="text-sm text-gray-600">After Workout:</span>
                <p className="font-medium capitalize">{workout.mood.after}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;