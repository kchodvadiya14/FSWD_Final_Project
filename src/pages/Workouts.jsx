import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fitnessDataManager from '../services/fitnessDataManager';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  FireIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  FunnelIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    workoutType: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      
      // Get workouts from local data manager
      let workoutsData = fitnessDataManager.getWorkouts();
      
      // Apply filters
      if (filters.workoutType !== 'all') {
        workoutsData = workoutsData.filter(w => w.type === filters.workoutType);
      }
      
      // Apply sorting
      workoutsData.sort((a, b) => {
        let aVal, bVal;
        switch (filters.sortBy) {
          case 'date':
            aVal = new Date(a.date);
            bVal = new Date(b.date);
            break;
          case 'duration':
            aVal = a.duration;
            bVal = b.duration;
            break;
          case 'calories':
            aVal = a.caloriesBurned || 0;
            bVal = b.caloriesBurned || 0;
            break;
          default:
            aVal = new Date(a.date);
            bVal = new Date(b.date);
        }
        
        return filters.sortOrder === 'desc' ? bVal - aVal || bVal.getTime() - aVal.getTime() : aVal - bVal || aVal.getTime() - bVal.getTime();
      });
      
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get stats from local data manager
      const statsData = fitnessDataManager.getWorkoutStats(30); // Last 30 days
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch workout stats:', error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    fetchStats();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      fitnessDataManager.deleteWorkout(id);
      toast.success('Workout deleted successfully');
      fetchWorkouts();
      fetchStats(); // Refresh stats after deletion
      fetchStats();
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

  const getWorkoutTypeColor = (type) => {
    const colors = {
      strength: 'bg-red-100 text-red-800',
      cardio: 'bg-blue-100 text-blue-800',
      flexibility: 'bg-green-100 text-green-800',
      sports: 'bg-purple-100 text-purple-800',
      mixed: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading && workouts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
          <p className="text-gray-600">
            Track and manage your fitness sessions 
            {workouts.length > 0 && <span className="font-medium">({workouts.length} found)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchWorkouts();
              fetchStats();
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            🔄 Refresh
          </button>
          <Link
            to="/workouts/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            New Workout
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.summary?.totalWorkouts || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FireIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Calories Burned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.summary?.totalCalories || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(stats.summary?.totalDuration || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(Math.round(stats.summary?.avgDuration || 0))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={filters.workoutType}
            onChange={(e) => setFilters(prev => ({ ...prev, workoutType: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="sports">Sports</option>
            <option value="mixed">Mixed</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="date">Date</option>
            <option value="duration">Duration</option>
            <option value="caloriesBurned">Calories</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Workouts List */}
      <div className="bg-white rounded-lg shadow">
        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first workout.</p>
            <div className="mt-6">
              <Link
                to="/workouts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Workout
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {workouts.map((workout) => (
              <div key={workout._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{workout.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWorkoutTypeColor(workout.workoutType)}`}>
                        {workout.workoutType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{workout.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(workout.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {formatDuration(workout.totalDuration?.value || workout.duration?.value || workout.durationInMinutes || 0)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FireIcon className="h-4 w-4" />
                        {workout.totalCaloriesBurned || workout.caloriesBurned || 0} cal
                      </div>
                      <div>
                        {workout.exercises?.length || 0} exercises
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      to={`/workouts/${workout._id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDeleteWorkout(workout._id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;