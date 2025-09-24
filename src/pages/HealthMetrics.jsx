import React, { useState, useEffect } from 'react';
import fitnessDataManager from '../services/fitnessDataManager';
import {
  HeartIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  BeakerIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const HealthMetrics = () => {
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  const fetchHealthMetrics = () => {
    try {
      setLoading(true);
      const metrics = fitnessDataManager.getCurrentHealthMetrics();
      setHealthMetrics(metrics);
    } catch (error) {
      console.error('Failed to fetch health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Metrics</h1>
        <p className="text-gray-600">Monitor your daily activity and vital health measurements</p>
      </div>

      {/* Today's Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Steps */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Steps</h3>
              <p className="text-sm text-gray-500">Daily Goal: {healthMetrics?.stepsGoal || 10000}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-blue-600">
                {(healthMetrics?.steps || 0).toLocaleString()}
              </span>
              <span className={`text-sm font-medium ${
                ((healthMetrics?.steps || 0) / (healthMetrics?.stepsGoal || 10000)) >= 1 
                  ? 'text-green-600' 
                  : 'text-orange-600'
              }`}>
                {Math.round(((healthMetrics?.steps || 0) / (healthMetrics?.stepsGoal || 10000)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full" 
                style={{ 
                  width: `${Math.min(100, ((healthMetrics?.steps || 0) / (healthMetrics?.stepsGoal || 10000)) * 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {Math.max(0, (healthMetrics?.stepsGoal || 10000) - (healthMetrics?.steps || 0)).toLocaleString()} steps to goal
            </p>
          </div>
        </div>

        {/* Calories Burned */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FireIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Calories Burned</h3>
              <p className="text-sm text-gray-500">Daily Goal: {healthMetrics?.caloriesBurnedGoal || 500}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-red-600">
                {(healthMetrics?.caloriesBurned || 0).toLocaleString()}
              </span>
              <span className={`text-sm font-medium ${
                ((healthMetrics?.caloriesBurned || 0) / (healthMetrics?.caloriesBurnedGoal || 500)) >= 1 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`}>
                {Math.round(((healthMetrics?.caloriesBurned || 0) / (healthMetrics?.caloriesBurnedGoal || 500)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-red-500 h-3 rounded-full" 
                style={{ 
                  width: `${Math.min(100, ((healthMetrics?.caloriesBurned || 0) / (healthMetrics?.caloriesBurnedGoal || 500)) * 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {Math.max(0, (healthMetrics?.caloriesBurnedGoal || 500) - (healthMetrics?.caloriesBurned || 0))} calories to goal
            </p>
          </div>
        </div>

        {/* Active Minutes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ClockIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Minutes</h3>
              <p className="text-sm text-gray-500">Daily Goal: {healthMetrics?.activeMinutesGoal || 60}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-green-600">
                {healthMetrics?.activeMinutes || 0}
              </span>
              <span className={`text-sm font-medium ${
                ((healthMetrics?.activeMinutes || 0) / (healthMetrics?.activeMinutesGoal || 60)) >= 1 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`}>
                {Math.round(((healthMetrics?.activeMinutes || 0) / (healthMetrics?.activeMinutesGoal || 60)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full" 
                style={{ 
                  width: `${Math.min(100, ((healthMetrics?.activeMinutes || 0) / (healthMetrics?.activeMinutesGoal || 60)) * 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {Math.max(0, (healthMetrics?.activeMinutesGoal || 60) - (healthMetrics?.activeMinutes || 0))} minutes to goal
            </p>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <HeartIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Heart Rate</h3>
              <p className="text-sm text-gray-500">Current BPM</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-red-600">
              {healthMetrics?.heartRate?.resting || 72} bpm
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Resting:</span>
                <span className="font-medium ml-1">{healthMetrics?.heartRate?.resting || 65} bpm</span>
              </div>
              <div>
                <span className="text-gray-600">Max Today:</span>
                <span className="font-medium ml-1">{healthMetrics?.heartRate?.max || 185} bpm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MoonIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Sleep</h3>
              <p className="text-sm text-gray-500">Last Night</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-purple-600">7.5h</span>
              <span className="text-sm text-green-600 font-medium">94%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-500 h-3 rounded-full" style={{ width: '94%' }}></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Quality Score:</span>
                <span className="font-medium ml-1">85%</span>
              </div>
              <div>
                <span className="text-gray-600">Deep Sleep:</span>
                <span className="font-medium ml-1">2.1h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hydration */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BeakerIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Hydration</h3>
              <p className="text-sm text-gray-500">Daily Goal: 8 glasses</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-blue-600">6/8</span>
              <span className="text-sm text-yellow-600 font-medium">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '75%' }}></div>
            </div>
            {/* Visual glasses indicator */}
            <div className="flex justify-between items-center mt-3">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`w-5 h-7 rounded-sm border-2 ${
                    i < 6 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-gray-200 border-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">2 glasses remaining</p>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">57,847</div>
            <div className="text-sm text-gray-600">Total Steps</div>
            <div className="text-xs text-green-600 mt-1">↑ 12% vs last week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">2,965</div>
            <div className="text-sm text-gray-600">Calories Burned</div>
            <div className="text-xs text-green-600 mt-1">↑ 8% vs last week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">311</div>
            <div className="text-sm text-gray-600">Active Minutes</div>
            <div className="text-xs text-red-600 mt-1">↓ 3% vs last week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">51.8</div>
            <div className="text-sm text-gray-600">Sleep Hours</div>
            <div className="text-xs text-green-600 mt-1">↑ 5% vs last week</div>
          </div>
        </div>
      </div>

      {/* Health Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Health Score</h2>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="85, 100"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">85</div>
                <div className="text-xs text-gray-600">Health Score</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-green-600 font-medium text-lg">Excellent</p>
          <p className="text-sm text-gray-600 mt-1">
            You're maintaining great health habits! Keep up the good work.
          </p>
        </div>
      </div>
    </div>
  );






};

export default HealthMetrics;