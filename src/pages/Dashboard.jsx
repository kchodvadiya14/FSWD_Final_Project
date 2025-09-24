import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import fitnessDataManager from '../services/fitnessDataManager';
import {
  ChartBarIcon,
  HeartIcon,
  ScaleIcon,
  CalendarDaysIcon,
  FireIcon,
  ClockIcon,
  TrophyIcon,
  PlusIcon,
  BeakerIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Use local fitness data manager
      const data = fitnessDataManager.getDashboardData();
      setDashboardData(data);
      
      // Check for new achievements
      const newAchievements = fitnessDataManager.checkAndUnlockAchievements();
      newAchievements.forEach(achievement => {
        toast.success(`🎉 Achievement Unlocked: ${achievement.title}!`);
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading your fitness dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 mb-4">Unable to load dashboard data</p>
        <button 
          onClick={fetchDashboardData}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { workoutStats, todaysNutrition, todaysMetrics, goals, streaks, recentWorkouts, summary } = dashboardData;

  const statsCards = [
    {
      title: 'This Week',
      value: `${workoutStats.totalWorkouts} workouts`,
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      change: `${workoutStats.totalDuration}min total`,
      trend: 'up'
    },
    {
      title: 'Calories Burned',
      value: `${workoutStats.totalCalories}`,
      icon: FireIcon,
      color: 'bg-red-500',
      change: `Avg: ${workoutStats.avgCalories}/workout`,
      trend: 'up'
    },
    {
      title: 'Current Weight',
      value: `${summary.currentWeight}kg`,
      icon: ScaleIcon,
      color: 'bg-green-500',
      change: `Goal: ${summary.targetWeight}kg`,
      trend: summary.currentWeight > summary.targetWeight ? 'down' : 'up'
    },
    {
      title: 'Workout Streak',
      value: `${streaks.workout.current} days`,
      icon: TrophyIcon,
      color: 'bg-yellow-500',
      change: `Best: ${streaks.workout.longest} days`,
      trend: 'up'
    }
  ];

  const quickActions = [
    {
      title: 'Log Workout',
      description: 'Record your latest training session',
      icon: ChartBarIcon,
      href: '/workouts/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Add Meal',
      description: 'Track your nutrition intake',
      icon: HeartIcon,
      href: '/nutrition/new',
      color: 'bg-green-500'
    },
    {
      title: 'Update Weight',
      description: 'Log your current body weight',
      icon: ScaleIcon,
      href: '/health/weight',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-indigo-100">
          You're doing great! Here's your fitness summary for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className={`${action.color} rounded-lg p-2`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Nutrition */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Nutrition</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Calories</span>
                <span className="text-gray-900">{todaysNutrition.totalCalories}/{summary.dailyCalorieTarget}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((todaysNutrition.totalCalories / summary.dailyCalorieTarget) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Protein</span>
                <span className="text-gray-900">{todaysNutrition.totalProtein}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((todaysNutrition.totalProtein / 150) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Water</span>
                <span className="text-gray-900">{todaysNutrition.waterIntake}/{summary.dailyWaterTarget} glasses</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full" 
                  style={{ width: `${(todaysNutrition.waterIntake / summary.dailyWaterTarget) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Workouts</h2>
            <Link
              to="/workouts"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentWorkouts && recentWorkouts.length > 0 ? recentWorkouts.slice(0, 3).map((workout, index) => (
              <div key={workout.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{workout.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(workout.date).toLocaleDateString()} • {workout.duration}min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{workout.caloriesBurned} cal</p>
                  <p className="text-sm text-gray-500 capitalize">{workout.type}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by logging your first workout.
                </p>
                <div className="mt-6">
                  <Link
                    to="/workouts/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Log Workout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals && goals.length > 0 ? goals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">{goal.title}</h3>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  {goal.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                Target: {goal.target} • Current: {goal.current}
              </p>
            </div>
          )) : (
            <div className="col-span-3 text-center py-6">
              <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active goals</h3>
              <p className="mt-1 text-sm text-gray-500">
                Set some fitness goals to track your progress.
              </p>
            </div>
          )}
        </div>

        {goals && goals.length > 3 && (
          <div className="mt-4 text-center">
            <Link
              to="/progress"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              View all goals →
            </Link>
          </div>
        )}
      </div>

      {/* Today's Health Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <HeartIcon className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Steps</p>
            <p className="text-lg font-semibold text-blue-600">{todaysMetrics.steps?.toLocaleString() || 0}</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <ScaleIcon className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Weight</p>
            <p className="text-lg font-semibold text-green-600">{todaysMetrics.weight || summary.currentWeight}kg</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <BoltIcon className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Energy</p>
            <p className="text-lg font-semibold text-purple-600">{todaysMetrics.energy || 7}/10</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <BeakerIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Sleep</p>
            <p className="text-lg font-semibold text-yellow-600">{todaysMetrics.sleep?.hours || 8}h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
