import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  FireIcon, 
  ScaleIcon, 
  ChartBarIcon,
  CalendarIcon,
  TargetIcon
} from '@heroicons/react/24/outline';

const Progress = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    // Sample progress data
    const sampleData = {
      week: {
        workoutsCompleted: 4,
        workoutGoal: 5,
        caloriesBurned: 1200,
        calorieGoal: 1500,
        weightLoss: 0.5,
        weightGoal: 2,
        streakDays: 6
      },
      month: {
        workoutsCompleted: 16,
        workoutGoal: 20,
        caloriesBurned: 4800,
        calorieGoal: 6000,
        weightLoss: 2.1,
        weightGoal: 4,
        streakDays: 6
      },
      year: {
        workoutsCompleted: 180,
        workoutGoal: 200,
        caloriesBurned: 54000,
        calorieGoal: 60000,
        weightLoss: 8.5,
        weightGoal: 10,
        streakDays: 6
      }
    };
    setProgressData(sampleData);
  }, []);

  const currentData = progressData[timeframe] || {};

  const progressCards = [
    {
      title: 'Workouts Completed',
      current: currentData.workoutsCompleted || 0,
      goal: currentData.workoutGoal || 0,
      icon: FireIcon,
      color: 'orange',
      suffix: 'workouts'
    },
    {
      title: 'Calories Burned',
      current: currentData.caloriesBurned || 0,
      goal: currentData.calorieGoal || 0,
      icon: ChartBarIcon,
      color: 'red',
      suffix: 'cal'
    },
    {
      title: 'Weight Progress',
      current: currentData.weightLoss || 0,
      goal: currentData.weightGoal || 0,
      icon: ScaleIcon,
      color: 'blue',
      suffix: 'kg',
      isWeight: true
    }
  ];

  const achievements = [
    { 
      id: 1, 
      title: 'First Workout', 
      description: 'Complete your first workout session', 
      achieved: true, 
      date: '2024-01-01' 
    },
    { 
      id: 2, 
      title: 'Weekly Warrior', 
      description: 'Complete 5 workouts in a week', 
      achieved: true, 
      date: '2024-01-07' 
    },
    { 
      id: 3, 
      title: 'Consistency Champion', 
      description: 'Maintain a 7-day workout streak', 
      achieved: false, 
      date: null 
    },
    { 
      id: 4, 
      title: 'Calorie Crusher', 
      description: 'Burn 1000 calories in a single week', 
      achieved: true, 
      date: '2024-01-08' 
    },
    { 
      id: 5, 
      title: 'Weight Loss Milestone', 
      description: 'Lose your first 5kg', 
      achieved: false, 
      date: null 
    }
  ];

  const getProgressPercentage = (current, goal) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600">Monitor your fitness journey and achievements</p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                timeframe === period
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {progressCards.map((card, index) => {
          const percentage = getProgressPercentage(card.current, card.goal);
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${card.color}-100 rounded-xl flex items-center justify-center`}>
                  <card.icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
                <span className="text-sm font-medium text-gray-600">{percentage.toFixed(0)}%</span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {card.isWeight ? '-' : ''}{card.current}{' '}
                  <span className="text-sm font-normal text-gray-500">
                    / {card.goal} {card.suffix}
                  </span>
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r from-${card.color}-500 to-${card.color}-600 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Streak */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
            <p className="text-3xl font-bold">{currentData.streakDays || 0} Days</p>
            <p className="text-green-100 mt-1">Keep it up! You're doing great!</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <FireIcon className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Weight Progress Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {/* Simple bar chart representation */}
          {[70, 69.5, 69.2, 68.8, 68.5, 68.1, 67.8].map((weight, index) => {
            const height = ((72 - weight) / 4) * 100; // Normalize height
            return (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="text-xs text-gray-600">{weight}kg</div>
                <div
                  className="w-8 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-gray-500">W{index + 1}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrophyIcon className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.achieved
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    achievement.achieved ? 'text-yellow-800' : 'text-gray-700'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    achievement.achieved ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.achieved && achievement.date && (
                    <p className="text-xs text-yellow-500 mt-2">
                      Achieved on {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  achievement.achieved ? 'bg-yellow-200' : 'bg-gray-200'
                }`}>
                  {achievement.achieved ? (
                    <TrophyIcon className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <TargetIcon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;