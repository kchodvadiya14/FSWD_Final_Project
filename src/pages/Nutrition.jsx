import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { nutritionService } from '../services/userService';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  FireIcon,
  ChartBarIcon,
  CalendarIcon,
  FunnelIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const Nutrition = () => {
  const [nutritionEntries, setNutritionEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({
    mealType: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchNutritionEntries();
    fetchNutritionStats();
  }, [selectedDate, filters]);

  const fetchNutritionEntries = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getNutritionEntries({
        ...filters,
        date: selectedDate
      });
      setNutritionEntries(data.data || []);
    } catch (error) {
      console.error('Failed to fetch nutrition entries:', error);
      toast.error('Failed to load nutrition data');
    } finally {
      setLoading(false);
    }
  };

  const fetchNutritionStats = async () => {
    try {
      const data = await nutritionService.getNutritionStats(selectedDate);
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch nutrition stats:', error);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this nutrition entry?')) {
      return;
    }

    try {
      await nutritionService.deleteNutritionEntry(id);
      toast.success('Nutrition entry deleted successfully');
      fetchNutritionEntries();
      fetchNutritionStats();
    } catch (error) {
      console.error('Failed to delete nutrition entry:', error);
      toast.error('Failed to delete nutrition entry');
    }
  };

  const getMealTypeColor = (type) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800',
      lunch: 'bg-green-100 text-green-800',
      dinner: 'bg-blue-100 text-blue-800',
      snack: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTotalNutrition = () => {
    return nutritionEntries.reduce((totals, entry) => {
      return {
        calories: totals.calories + (entry.totalNutrition?.calories || 0),
        protein: totals.protein + (entry.totalNutrition?.protein || 0),
        carbs: totals.carbs + (entry.totalNutrition?.carbs || 0),
        fats: totals.fats + (entry.totalNutrition?.fats || 0),
        fiber: totals.fiber + (entry.totalNutrition?.fiber || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  };

  const dailyTotals = getTotalNutrition();

  if (loading && nutritionEntries.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracking</h1>
          <p className="text-gray-600">Track your meals and nutrition intake</p>
        </div>
        <Link
          to="/nutrition/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Log Meal
        </Link>
      </div>

      {/* Date Selection and Daily Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FireIcon className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Calories</p>
                  <p className="text-lg font-bold text-gray-900">{Math.round(dailyTotals.calories)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BeakerIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Protein</p>
                  <p className="text-lg font-bold text-gray-900">{Math.round(dailyTotals.protein)}g</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Carbs</p>
                  <p className="text-lg font-bold text-gray-900">{Math.round(dailyTotals.carbs)}g</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BeakerIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Fats</p>
                  <p className="text-lg font-bold text-gray-900">{Math.round(dailyTotals.fats)}g</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BeakerIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Fiber</p>
                  <p className="text-lg font-bold text-gray-900">{Math.round(dailyTotals.fiber)}g</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={filters.mealType}
            onChange={(e) => setFilters(prev => ({ ...prev, mealType: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="createdAt">Time</option>
            <option value="mealType">Meal Type</option>
            <option value="totalNutrition.calories">Calories</option>
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

      {/* Nutrition Entries */}
      <div className="bg-white rounded-lg shadow">
        {nutritionEntries.length === 0 ? (
          <div className="text-center py-12">
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No nutrition entries</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start tracking your meals for {new Date(selectedDate).toLocaleDateString()}.
            </p>
            <div className="mt-6">
              <Link
                to="/nutrition/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Log Meal
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {nutritionEntries.map((entry) => (
              <div key={entry._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMealTypeColor(entry.mealType)}`}>
                        {entry.mealType}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {entry.foodItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                            {item.brand && <span className="text-gray-500 ml-2">({item.brand})</span>}
                            <div className="text-sm text-gray-500">
                              {item.quantity.value} {item.quantity.unit}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {Math.round(item.nutrition.calories)} cal
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FireIcon className="h-4 w-4" />
                        {Math.round(entry.totalNutrition?.calories || 0)} cal
                      </div>
                      <div>
                        P: {Math.round(entry.totalNutrition?.protein || 0)}g
                      </div>
                      <div>
                        C: {Math.round(entry.totalNutrition?.carbs || 0)}g
                      </div>
                      <div>
                        F: {Math.round(entry.totalNutrition?.fats || 0)}g
                      </div>
                    </div>

                    {entry.notes && (
                      <p className="mt-2 text-sm text-gray-600 italic">{entry.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      to={`/nutrition/${entry._id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteEntry(entry._id)}
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

export default Nutrition;