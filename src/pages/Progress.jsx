import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { workoutService, nutritionService, goalService } from '../services/fitnessService';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';
import {
  ChartBarIcon,
  TrendingUpIcon,
  FireIcon,
  CalendarIcon,
  ClockIcon,
  TargetIcon
} from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [progressData, setProgressData] = useState({
    workoutStats: null,
    nutritionStats: null,
    goals: [],
    weightProgress: [],
    workoutTrend: [],
    nutritionTrend: []
  });

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch workout statistics
      const workoutStats = await workoutService.getWorkoutStats(timeRange);
      
      // Fetch goals
      const goalsData = await goalService.getGoals();
      
      // Simulate weight progress and trends (in a real app, these would come from the backend)
      const weightProgress = generateMockWeightData();
      const workoutTrend = generateMockWorkoutTrend();
      const nutritionTrend = generateMockNutritionTrend();

      setProgressData({
        workoutStats: workoutStats.data,
        goals: goalsData.data || [],
        weightProgress,
        workoutTrend,
        nutritionTrend
      });
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  // Mock data generators (replace with real API calls)
  const generateMockWeightData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));
    
    for (let i = 0; i < parseInt(timeRange); i += 3) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString().split('T')[0],
        weight: 75 + (Math.random() - 0.5) * 2 // Random weight around 75kg
      });
    }
    return data;
  };

  const generateMockWorkoutTrend = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));
    
    for (let i = 0; i < parseInt(timeRange); i += 7) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        week: date.toLocaleDateString(),
        workouts: Math.floor(Math.random() * 5) + 1,
        calories: Math.floor(Math.random() * 2000) + 1000
      });
    }
    return data;
  };

  const generateMockNutritionTrend = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));
    
    for (let i = 0; i < parseInt(timeRange); i += 7) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        week: date.toLocaleDateString(),
        calories: Math.floor(Math.random() * 500) + 1800,
        protein: Math.floor(Math.random() * 50) + 100,
        carbs: Math.floor(Math.random() * 100) + 200,
        fats: Math.floor(Math.random() * 30) + 60
      });
    }
    return data;
  };

  // Chart configurations
  const weightChartData = {
    labels: progressData.weightProgress.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: progressData.weightProgress.map(d => d.weight),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }
    ]
  };

  const workoutTrendData = {
    labels: progressData.workoutTrend.map(d => d.week),
    datasets: [
      {
        label: 'Workouts',
        data: progressData.workoutTrend.map(d => d.workouts),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const nutritionPieData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: [
          progressData.nutritionTrend.reduce((sum, d) => sum + d.protein, 0),
          progressData.nutritionTrend.reduce((sum, d) => sum + d.carbs, 0),
          progressData.nutritionTrend.reduce((sum, d) => sum + d.fats, 0)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600">Monitor your fitness journey and achievements</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Workouts</p>
              <p className="text-2xl font-bold text-gray-900">
                {progressData.workoutStats?.summary?.totalWorkouts || 0}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {progressData.workoutStats?.summary?.totalCalories || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Exercise Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((progressData.workoutStats?.summary?.totalDuration || 0) / 60)}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TargetIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">
                {progressData.goals.filter(g => g.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weight Progress</h3>
          <div className="h-64">
            <Line data={weightChartData} options={chartOptions} />
          </div>
        </div>

        {/* Workout Frequency */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Workout Frequency</h3>
          <div className="h-64">
            <Bar data={workoutTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Nutrition Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Macronutrient Distribution</h3>
          <div className="h-64">
            <Doughnut 
              data={nutritionPieData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Goals Progress</h3>
          <div className="space-y-4">
            {progressData.goals.slice(0, 4).map((goal) => (
              <div key={goal._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
                  <span className="text-sm text-gray-500">
                    {Math.round(goal.progressPercentage || 0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${Math.min(goal.progressPercentage || 0, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{goal.currentValue} {goal.unit}</span>
                  <span>{goal.targetValue} {goal.unit}</span>
                </div>
              </div>
            ))}
            {progressData.goals.length === 0 && (
              <p className="text-gray-500 text-center py-4">No goals set yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full">
                <TrendingUpIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">Consistency</h4>
                <p className="text-xs text-yellow-600">7 days workout streak!</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <FireIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">Calorie Burn</h4>
                <p className="text-xs text-green-600">1000+ calories in a session</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <TargetIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Goal Achieved</h4>
                <p className="text-xs text-blue-600">Weight loss milestone reached</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">This Week's Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-600">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">3.2</div>
            <div className="text-sm text-gray-600">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">2,450</div>
            <div className="text-sm text-gray-600">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">85%</div>
            <div className="text-sm text-gray-600">Goal Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;