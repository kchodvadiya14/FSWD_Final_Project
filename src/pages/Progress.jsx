import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  StarIcon,
  BoltIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [selectedMetric, setSelectedMetric] = useState('weight');

  // Mock progress data
  const progressData = {
    weight: {
      current: 73.5,
      start: 75.2,
      goal: 70.0,
      change: -1.7,
      data: [75.2, 74.8, 74.5, 74.3, 74.1, 73.9, 73.5]
    },
    steps: {
      current: 8247,
      goal: 10000,
      average: 7823,
      data: [7500, 8200, 9100, 8800, 7200, 9500, 8247],
      streak: 12
    },
    workouts: {
      thisWeek: 4,
      lastWeek: 3,
      streak: 8,
      total: 42,
      data: [3, 4, 2, 5, 4, 3, 4]
    },
    calories: {
      burned: 2340,
      goal: 2500,
      data: [2100, 2340, 2580, 2200, 1980, 2650, 2340]
    },
    sleep: {
      average: 7.4,
      goal: 8.0,
      quality: 85,
      data: [7.2, 8.1, 6.8, 7.9, 6.5, 8.3, 7.4]
    }
  };

  // Achievements and milestones
  const achievements = [
    {
      id: 1,
      title: "Weight Loss Champion",
      description: "Lost 5 pounds in 30 days",
      icon: ScaleIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
      date: "2 days ago",
      completed: true
    },
    {
      id: 2,
      title: "Workout Warrior",
      description: "7 day workout streak",
      icon: BoltIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      date: "1 week ago",
      completed: true
    },
    {
      id: 3,
      title: "Step Master",
      description: "10,000 steps daily for 14 days",
      icon: ArrowTrendingUpIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      date: "3 days ago",
      completed: true
    },
    {
      id: 4,
      title: "Sleep Champion",
      description: "8+ hours sleep for 5 nights",
      icon: StarIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      date: "In progress",
      completed: false
    }
  ];

  const streaks = [
    {
      type: "Workouts",
      current: 8,
      best: 15,
      icon: BoltIcon,
      color: "text-orange-600"
    },
    {
      type: "Steps Goal",
      current: 12,
      best: 23,
      icon: ArrowTrendingUpIcon,
      color: "text-blue-600"
    },
    {
      type: "Sleep Goal",
      current: 3,
      best: 9,
      icon: StarIcon,
      color: "text-purple-600"
    }
  ];

  // Chart data configuration
  const getChartData = () => {
    const labels = timeRange === 'weekly' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : timeRange === 'monthly'
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const data = progressData[selectedMetric]?.data || [];

    return {
      labels,
      datasets: [
        {
          label: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
          data: data,
          borderColor: getMetricColor(selectedMetric),
          backgroundColor: getMetricColor(selectedMetric, 0.1),
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: getMetricColor(selectedMetric),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6
        }
      ]
    };
  };

  const getMetricColor = (metric, opacity = 1) => {
    const colors = {
      weight: `rgba(239, 68, 68, ${opacity})`,
      steps: `rgba(59, 130, 246, ${opacity})`,
      workouts: `rgba(34, 197, 94, ${opacity})`,
      calories: `rgba(245, 158, 11, ${opacity})`,
      sleep: `rgba(147, 51, 234, ${opacity})`
    };
    return colors[metric] || `rgba(107, 114, 128, ${opacity})`;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: getMetricColor(selectedMetric),
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#6b7280'
        }
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
            <p className="text-gray-600">Monitor your fitness journey and celebrate achievements</p>
          </div>
          
          {/* Time Range Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { value: 'weekly', label: 'Week' },
              { value: 'monthly', label: 'Month' },
              { value: 'yearly', label: 'Year' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weight Progress</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.weight.current} kg</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {Math.abs(progressData.weight.change)} kg lost
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ScaleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Daily Steps</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.steps.current.toLocaleString()}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <BoltIcon className="h-4 w-4 mr-1" />
                {progressData.steps.streak} day streak
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Workouts This Week</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.workouts.thisWeek}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrophyIcon className="h-4 w-4 mr-1" />
                {progressData.workouts.streak} day streak
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BoltIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sleep Average</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.sleep.average}h</p>
              <p className="text-sm text-purple-600 flex items-center mt-1">
                <StarIcon className="h-4 w-4 mr-1" />
                {progressData.sleep.quality}% quality
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <StarIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Progress Trends</h2>
          
          {/* Metric Selector */}
          <div className="flex space-x-2">
            {[
              { value: 'weight', label: 'Weight', color: 'text-red-600' },
              { value: 'steps', label: 'Steps', color: 'text-blue-600' },
              { value: 'workouts', label: 'Workouts', color: 'text-green-600' },
              { value: 'calories', label: 'Calories', color: 'text-yellow-600' },
              { value: 'sleep', label: 'Sleep', color: 'text-purple-600' }
            ].map((metric) => (
              <button
                key={metric.value}
                onClick={() => setSelectedMetric(metric.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === metric.value
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-80">
          <Line data={getChartData()} options={chartOptions} />
        </div>
      </div>

      {/* Achievements & Milestones */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                achievement.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${achievement.bgColor}`}>
                    <Icon className={`h-6 w-6 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      {achievement.completed && (
                        <TrophyIcon className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{achievement.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streaks Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Streaks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {streaks.map((streak, index) => {
            const Icon = streak.icon;
            const percentage = Math.round((streak.current / streak.best) * 100);
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-full ${streak.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`h-8 w-8 ${streak.color}`} />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{streak.type}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{streak.current}</span>
                  <span className="text-sm text-gray-600 ml-1">days</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Best: {streak.best} days</p>
                
                {/* Progress Ring */}
                <div className="mt-4 flex justify-center">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={streak.color === 'text-orange-600' ? '#ea580c' : streak.color === 'text-blue-600' ? '#2563eb' : '#9333ea'}
                        strokeWidth="3"
                        strokeDasharray={`${percentage}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Goal Progress</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <ScaleIcon className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-medium text-gray-900">Weight Loss Goal</h3>
                <p className="text-sm text-gray-600">Target: 70 kg</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">73.5 kg</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">67% complete</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Daily Steps</h3>
                <p className="text-sm text-gray-600">Target: 10,000 steps</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">8,247</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">82% complete</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <StarIcon className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-medium text-gray-900">Sleep Goal</h3>
                <p className="text-sm text-gray-600">Target: 8 hours</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">7.4h</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '93%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">93% complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
