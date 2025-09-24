import React, { useState, useEffect, useCallback } from 'react';
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
  const [allEntries, setAllEntries] = useState([]); // Store all entries for filtering
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({
    mealType: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Function to apply filters to entries
  const applyFilters = useCallback((entries) => {
    console.log('🔧 Applying filters:', filters, 'to entries:', entries);
    
    let processedEntries = [];
    
    // Convert daily entries to individual meal entries for better filtering
    entries.forEach(entry => {
      if (entry.meals) {
        // New format: expand each meal type into separate entries
        Object.entries(entry.meals).forEach(([mealType, foodItems]) => {
          if (foodItems && foodItems.length > 0) {
            // Calculate nutrition for this specific meal
            const mealNutrition = foodItems.reduce((totals, item) => ({
              calories: totals.calories + (item.nutrition?.calories || 0),
              protein: totals.protein + (item.nutrition?.protein || 0),
              carbs: totals.carbs + (item.nutrition?.carbs || 0),
              fats: totals.fats + (item.nutrition?.fats || 0),
              fiber: totals.fiber + (item.nutrition?.fiber || 0)
            }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
            
            processedEntries.push({
              ...entry,
              mealType,
              foodItems,
              totalNutrition: mealNutrition,
              dailyTotals: mealNutrition, // For compatibility
              _originalEntry: entry // Keep reference to original
            });
          }
        });
      } else {
        // Old format: keep as is
        processedEntries.push(entry);
      }
    });
    
    // Filter by meal type if not 'all'
    if (filters.mealType !== 'all') {
      processedEntries = processedEntries.filter(entry => entry.mealType === filters.mealType);
    }
    
    // Apply sorting
    processedEntries.sort((a, b) => {
      let valueA, valueB;
      
      switch (filters.sortBy) {
        case 'createdAt':
          valueA = new Date(a.createdAt || a.date);
          valueB = new Date(b.createdAt || b.date);
          break;
        case 'mealType':
          valueA = a.mealType || '';
          valueB = b.mealType || '';
          break;
        case 'calories':
          valueA = (a.dailyTotals || a.totalNutrition)?.calories || 0;
          valueB = (b.dailyTotals || b.totalNutrition)?.calories || 0;
          break;
        default:
          valueA = a[filters.sortBy] || 0;
          valueB = b[filters.sortBy] || 0;
      }
      
      if (filters.sortOrder === 'desc') {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      } else {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      }
    });
    
    console.log('✅ Processed and filtered entries:', processedEntries);
    setNutritionEntries(processedEntries);
  }, [filters]);

  const fetchNutritionEntries = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching nutrition entries for date:', selectedDate);
      
      const response = await nutritionService.getNutritionEntries({
        date: selectedDate,
        limit: 50 // Get more entries to ensure we have all for the day
      });
      
      console.log('📦 Nutrition entries response:', response);
      
      // Handle different response structures
      const entries = response?.data?.nutritionEntries || response?.data || response?.nutritionEntries || response || [];
      console.log('✅ Extracted entries:', entries);
      
      const allEntriesArray = Array.isArray(entries) ? entries : [];
      setAllEntries(allEntriesArray);
      
      // Apply filters to the entries
      applyFilters(allEntriesArray);
    } catch (error) {
      console.error('❌ Failed to fetch nutrition entries:', error);
      toast.error('Failed to load nutrition data: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [selectedDate, applyFilters]);

  // Apply filters when filters change
  useEffect(() => {
    if (allEntries.length > 0) {
      applyFilters(allEntries);
    }
  }, [filters, allEntries, applyFilters]);

  const fetchNutritionStats = useCallback(async () => {
    try {
      console.log('📊 Fetching nutrition stats for date:', selectedDate);
      
      const response = await nutritionService.getNutritionStats(selectedDate);
      console.log('📈 Nutrition stats response:', response);
      
      // Handle different response structures
      const statsData = response?.data?.stats || response?.data || response || {};
      console.log('✅ Extracted stats:', statsData);
      
      // Stats are calculated on frontend now from filtered data
    } catch (error) {
      console.error('❌ Failed to fetch nutrition stats:', error);
      // Don't show error toast for stats, it's not critical
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchNutritionEntries();
    fetchNutritionStats();
  }, [fetchNutritionEntries, fetchNutritionStats]);

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
    // If showing all meals, calculate from all original entries to avoid double counting
    if (filters.mealType === 'all') {
      return allEntries.reduce((totals, entry) => {
        const entryTotals = entry.dailyTotals || {};
        return {
          calories: totals.calories + (entryTotals.calories || 0),
          protein: totals.protein + (entryTotals.protein || 0),
          carbs: totals.carbs + (entryTotals.carbs || 0),
          fats: totals.fats + (entryTotals.fats || 0),
          fiber: totals.fiber + (entryTotals.fiber || 0)
        };
      }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
    } else {
      // If filtering by meal type, sum only the filtered entries
      return nutritionEntries.reduce((totals, entry) => {
        const entryTotals = entry.dailyTotals || entry.totalNutrition || {};
        return {
          calories: totals.calories + (entryTotals.calories || 0),
          protein: totals.protein + (entryTotals.protein || 0),
          carbs: totals.carbs + (entryTotals.carbs || 0),
          fats: totals.fats + (entryTotals.fats || 0),
          fiber: totals.fiber + (entryTotals.fiber || 0)
        };
      }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
    }
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
          <div className="mt-3 text-sm text-gray-600">
            {filters.mealType === 'all' ? 
              'Showing daily totals' : 
              `Showing ${filters.mealType} only`
            }
          </div>
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
          
          {/* Active filters indicator */}
          {filters.mealType !== 'all' && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
              {filters.mealType.charAt(0).toUpperCase() + filters.mealType.slice(1)} only
            </span>
          )}
          <select
            value={filters.mealType}
            onChange={(e) => setFilters(prev => ({ ...prev, mealType: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="createdAt">Date/Time</option>
            <option value="mealType">Meal Type</option>
            <option value="calories">Calories</option>
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
                      {/* Show meal type - now each entry has a single mealType */}
                      {entry.mealType && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMealTypeColor(entry.mealType)}`}>
                          {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(entry.createdAt || entry.date).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Display food items - now each entry represents a single meal */}
                      {entry.foodItems && entry.foodItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                            {item.brand && <span className="text-gray-500 ml-2">({item.brand})</span>}
                            <div className="text-sm text-gray-500">
                              {item.quantity.value} {item.quantity.unit}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {Math.round(item.nutrition?.calories || 0)} cal
                          </div>
                        </div>
                      ))}
                      {/* Fallback for entries without foodItems */}
                      {!entry.foodItems && entry.meals && (
                        <div className="text-sm text-gray-500 italic">
                          Multiple meals - see daily totals below
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FireIcon className="h-4 w-4" />
                        {Math.round((entry.dailyTotals || entry.totalNutrition)?.calories || 0)} cal
                      </div>
                      <div>
                        P: {Math.round((entry.dailyTotals || entry.totalNutrition)?.protein || 0)}g
                      </div>
                      <div>
                        C: {Math.round((entry.dailyTotals || entry.totalNutrition)?.carbs || 0)}g
                      </div>
                      <div>
                        F: {Math.round((entry.dailyTotals || entry.totalNutrition)?.fats || 0)}g
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