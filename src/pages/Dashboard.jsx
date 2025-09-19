import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import {
  ChartBarIcon,
  HeartIcon,
  ScaleIcon,
  CalendarDaysIcon,
  FireIcon,
  ClockIcon,
  TrophyIcon,
  PlusIcon
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
      const data = await userService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Mock data for demonstration if API fails
  const mockData = {
    totalWorkouts: 15,
    totalCaloriesBurned: 2450,
    averageWorkoutDuration: 45,
    currentStreak: 5,
    weeklyWorkouts: 4,
    monthlyGoal: 16,
    todaysCalories: 1850,
    calorieGoal: 2200,
    waterIntake: 6,
    waterGoal: 8,
    weight: user?.weight || 70,
    weightGoal: (user?.weight || 70) - 5,
    recentWorkouts: [
      { id: 1, name: 'Push Day', date: '2024-01-15', duration: 60, calories: 320 },
      { id: 2, name: 'Cardio', date: '2024-01-14', duration: 30, calories: 180 },
      { id: 3, name: 'Pull Day', date: '2024-01-13', duration: 55, calories: 290 }
    ]
  };

  const data = dashboardData || mockData;

  const statsCards = [
    {
      title: 'Total Workouts',
      value: data.totalWorkouts || 0,
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      change: '+2 this week'
    },
    {
      title: 'Calories Burned',
      value: `${data.totalCaloriesBurned || 0}`,
      icon: FireIcon,
      color: 'bg-red-500',
      change: '+150 today'
    },
    {
      title: 'Avg Duration',
      value: `${data.averageWorkoutDuration || 0}m`,
      icon: ClockIcon,
      color: 'bg-green-500',
      change: '+5m from last week'
    },
    {
      title: 'Current Streak',
      value: `${data.currentStreak || 0} days`,
      icon: TrophyIcon,
      color: 'bg-yellow-500',
      change: 'Keep it up!'
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
        {/* Weekly Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Workouts</span>
                <span className="text-gray-900">{data.weeklyWorkouts}/{data.monthlyGoal} monthly goal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(data.weeklyWorkouts / data.monthlyGoal) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Calories</span>
                <span className="text-gray-900">{data.todaysCalories}/{data.calorieGoal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(data.todaysCalories / data.calorieGoal) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Water Intake</span>
                <span className="text-gray-900">{data.waterIntake}/{data.waterGoal} glasses</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full" 
                  style={{ width: `${(data.waterIntake / data.waterGoal) * 100}%` }}
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
            {data.recentWorkouts?.slice(0, 3).map((workout, index) => (
              <div key={workout.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{workout.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(workout.date).toLocaleDateString()} • {workout.duration}min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{workout.calories} cal</p>
                  <p className="text-sm text-gray-500">burned</p>
                </div>
              </div>
            )) || (
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

      {/* Today's Goals */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Complete Workout</h3>
            <p className="text-sm text-gray-500">45 minutes remaining</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <HeartIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Hit Calorie Goal</h3>
            <p className="text-sm text-gray-500">{data.calorieGoal - data.todaysCalories} calories to go</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <ScaleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Stay Hydrated</h3>
            <p className="text-sm text-gray-500">{data.waterGoal - data.waterIntake} glasses left</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
