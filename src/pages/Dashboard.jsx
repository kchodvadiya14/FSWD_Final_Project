import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  FireIcon, 
  HeartIcon, 
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    caloriesBurned: 0,
    mealsLogged: 0,
    streakDays: 0
  });

  // Simulated stats - in real app, fetch from API
  useEffect(() => {
    // You would fetch real data here
    setStats({
      workoutsThisWeek: 5,
      caloriesBurned: 2400,
      mealsLogged: 18,
      streakDays: 7
    });
  }, []);

  const quickActions = [
    {
      name: 'Log Workout',
      description: 'Track your exercise session',
      icon: FireIcon,
      color: 'bg-orange-500',
      link: '/workouts'
    },
    {
      name: 'Log Meal',
      description: 'Record your nutrition',
      icon: HeartIcon,
      color: 'bg-red-500',
      link: '/nutrition'
    },
    {
      name: 'View Progress',
      description: 'Check your health metrics',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      link: '/metrics'
    },
    {
      name: 'Profile',
      description: 'Update your information',
      icon: TrophyIcon,
      color: 'bg-purple-500',
      link: '/profile'
    }
  ];

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Champion'}! 👋
          </h2>
          <p className="text-indigo-100 text-lg">
            Ready to crush your fitness goals today?
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center">
              <FireIcon className="h-6 w-6 mr-2" />
              <div>
                <p className="text-sm text-indigo-200">Current Streak</p>
                <p className="text-2xl font-bold">{stats.streakDays} days</p>
              </div>
            </div>
            <div className="flex items-center ml-8">
              <ClockIcon className="h-6 w-6 mr-2" />
              <div>
                <p className="text-sm text-indigo-200">Member Since</p>
                <p className="text-lg font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FireIcon}
            label="Workouts This Week"
            value={stats.workoutsThisWeek}
            trend="+2"
            color="bg-orange-500"
          />
          <StatCard
            icon={ChartBarIcon}
            label="Calories Burned"
            value={`${stats.caloriesBurned}`}
            trend="+12%"
            color="bg-blue-500"
          />
          <StatCard
            icon={HeartIcon}
            label="Meals Logged"
            value={stats.mealsLogged}
            trend="+5"
            color="bg-red-500"
          />
          <StatCard
            icon={TrophyIcon}
            label="Active Streak"
            value={`${stats.streakDays} days`}
            color="bg-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.link}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className={`${action.color} p-3 rounded-lg inline-block mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  {action.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <div className="flex items-center text-indigo-600 text-sm font-medium">
                  Get Started
                  <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-4">
                  <FireIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Morning Cardio Session</p>
                  <p className="text-sm text-gray-600">30 minutes • 250 calories</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-4">
                  <HeartIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Breakfast Logged</p>
                  <p className="text-sm text-gray-600">450 calories • High protein</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">5 hours ago</span>
            </div>

            <div className="text-center pt-4">
              <Link
                to="/workouts"
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View All Activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg shadow-lg p-6 text-white text-center">
          <p className="text-xl font-semibold mb-2">
            "The only bad workout is the one that didn't happen."
          </p>
          <p className="text-blue-100">Keep pushing forward! 💪</p>
        </div>
      </div>
  );
};

export default Dashboard;