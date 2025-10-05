import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
<<<<<<< Updated upstream
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
=======
import { 
  FireIcon, 
  HeartIcon, 
  ChartBarIcon, 
  TrophyIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
>>>>>>> Stashed changes
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    todaysStats: {
      workoutsCompleted: 1,
      caloriesBurned: 280,
      caloriesConsumed: 1450,
      waterIntake: 6,
      sleepHours: 7.5
    },
    weeklyGoals: {
      workouts: { current: 4, target: 5 },
      calories: { current: 1200, target: 1500 },
      weight: { current: 68.5, target: 67 }
    },
    recentActivities: [
      { id: 1, type: 'workout', name: 'Morning Cardio', time: '2 hours ago', calories: 280 },
      { id: 2, type: 'meal', name: 'Healthy Breakfast', time: '3 hours ago', calories: 350 },
      { id: 3, type: 'water', name: 'Hydration Goal', time: '1 hour ago', glasses: 2 }
    ],
    upcomingWorkouts: [
      { id: 1, name: 'Strength Training', time: '15:00', duration: '45 min' },
      { id: 2, name: 'Yoga Session', time: '18:30', duration: '30 min' }
    ]
  });

<<<<<<< Updated upstream
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

=======
  const getProgressPercentage = (current, target) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

>>>>>>> Stashed changes
  const quickActions = [
    { name: 'Start Workout', icon: FireIcon, href: '/workouts', color: 'bg-red-500' },
    { name: 'Log Meal', icon: HeartIcon, href: '/nutrition', color: 'bg-green-500' },
    { name: 'Add Health Data', icon: ChartBarIcon, href: '/health', color: 'bg-blue-500' },
    { name: 'Chat with AI', icon: TrophyIcon, href: '/ai-coach', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-blue-100">
              {dashboardData.todaysStats.workoutsCompleted > 0 
                ? "Great job on staying active today! Keep up the momentum." 
                : "Ready to start your fitness journey today?"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{dashboardData.todaysStats.caloriesBurned}</p>
            <p className="text-blue-100">Calories burned today</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.href}
            className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <p className="font-medium text-gray-900">{action.name}</p>
          </Link>
        ))}
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FireIcon className="h-6 w-6 text-red-600" />
            </div>
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Workouts</h3>
          <p className="text-2xl font-bold text-gray-900">{dashboardData.todaysStats.workoutsCompleted}</p>
          <p className="text-sm text-gray-500">Completed today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">
              {Math.round((dashboardData.todaysStats.caloriesConsumed / 2000) * 100)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Calories</h3>
          <p className="text-2xl font-bold text-gray-900">{dashboardData.todaysStats.caloriesConsumed}</p>
          <p className="text-sm text-gray-500">/ 2000 consumed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <HeartIcon className="h-6 w-6 text-cyan-600" />
            </div>
            <span className="text-sm text-gray-600">
              {Math.round((dashboardData.todaysStats.waterIntake / 8) * 100)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Water Intake</h3>
          <p className="text-2xl font-bold text-gray-900">{dashboardData.todaysStats.waterIntake}</p>
          <p className="text-sm text-gray-500">/ 8 glasses</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrophyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600">Good</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Sleep</h3>
          <p className="text-2xl font-bold text-gray-900">{dashboardData.todaysStats.sleepHours}h</p>
          <p className="text-sm text-gray-500">Last night</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
<<<<<<< Updated upstream
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
=======
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
          <div className="space-y-4">
            {Object.entries(dashboardData.weeklyGoals).map(([key, goal]) => {
              const percentage = getProgressPercentage(goal.current, goal.target);
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key === 'calories' ? 'Calories Burned' : key}
                    </span>
                    <span className="text-sm text-gray-600">
                      {goal.current} / {goal.target} {key === 'weight' ? 'kg' : key === 'calories' ? 'cal' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
>>>>>>> Stashed changes
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
<<<<<<< Updated upstream
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
=======
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'workout' ? 'bg-red-100' :
                  activity.type === 'meal' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'workout' && <FireIcon className="h-4 w-4 text-red-600" />}
                  {activity.type === 'meal' && <HeartIcon className="h-4 w-4 text-green-600" />}
                  {activity.type === 'water' && <ChartBarIcon className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.name}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
                <div className="text-right">
                  {activity.calories && (
                    <p className="text-sm font-medium text-gray-900">{activity.calories} cal</p>
                  )}
                  {activity.glasses && (
                    <p className="text-sm font-medium text-gray-900">{activity.glasses} glasses</p>
                  )}
                </div>
              </div>
            ))}
>>>>>>> Stashed changes
          </div>
        </div>
      </div>

<<<<<<< Updated upstream
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
=======
      {/* Upcoming Workouts */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Workouts</h3>
          <Link
            to="/workouts"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        
        {dashboardData.upcomingWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.upcomingWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{workout.name}</p>
                    <p className="text-sm text-gray-600">{workout.time} • {workout.duration}</p>
                  </div>
                </div>
                <Link
                  to="/workouts"
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Start
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming workouts</h3>
            <p className="mt-1 text-sm text-gray-500">Schedule your next workout to stay on track.</p>
            <div className="mt-6">
              <Link
                to="/workouts"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Schedule Workout
              </Link>
            </div>
          </div>
        )}
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default Dashboard;