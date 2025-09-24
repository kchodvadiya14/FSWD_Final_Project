import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nutritionService } from '../services/userService';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  XMarkIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FireIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const NewMeal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mealData, setMealData] = useState({
    mealType: 'breakfast',
    date: new Date().toISOString().split('T')[0],
    foodItems: [],
    notes: ''
  });

  const [currentFood, setCurrentFood] = useState({
    name: '',
    brand: '',
    quantity: { value: 100, unit: 'grams' },
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    }
  });

  const [showFoodForm, setShowFoodForm] = useState(false);

  // Common food database (in a real app, this would be from an API)
  const commonFoods = [
    {
      name: 'Chicken Breast',
      nutrition: { calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0 }
    },
    {
      name: 'Brown Rice',
      nutrition: { calories: 111, protein: 2.6, carbs: 23, fats: 0.9, fiber: 1.8 }
    },
    {
      name: 'Banana',
      nutrition: { calories: 89, protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6 }
    },
    {
      name: 'Oatmeal',
      nutrition: { calories: 158, protein: 6, carbs: 28, fats: 3, fiber: 4 }
    },
    {
      name: 'Greek Yogurt',
      nutrition: { calories: 130, protein: 11, carbs: 9, fats: 5, fiber: 0 }
    },
    {
      name: 'Almonds',
      nutrition: { calories: 579, protein: 21, carbs: 22, fats: 50, fiber: 12 }
    }
  ];

  const units = [
    'grams', 'kg', 'ml', 'liters', 'cups', 'pieces', 
    'tablespoons', 'teaspoons', 'ounces', 'slices'
  ];

  const addFoodItem = () => {
    if (!currentFood.name.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    if (currentFood.quantity.value <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Calculate nutrition based on quantity (per 100g base)
    const ratio = currentFood.quantity.value / 100;
    const calculatedNutrition = {};
    
    Object.keys(currentFood.nutrition).forEach(key => {
      calculatedNutrition[key] = currentFood.nutrition[key] * ratio;
    });

    const newFoodItem = {
      ...currentFood,
      nutrition: calculatedNutrition,
      id: Date.now() // Simple ID for local state
    };

    setMealData(prev => ({
      ...prev,
      foodItems: [...prev.foodItems, newFoodItem]
    }));

    // Reset form
    setCurrentFood({
      name: '',
      brand: '',
      quantity: { value: 100, unit: 'grams' },
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      }
    });
    setShowFoodForm(false);
  };

  const removeFoodItem = (id) => {
    setMealData(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter(item => item.id !== id)
    }));
  };

  const selectCommonFood = (food) => {
    setCurrentFood(prev => ({
      ...prev,
      name: food.name,
      nutrition: { ...food.nutrition }
    }));
  };

  const calculateTotalNutrition = () => {
    return mealData.foodItems.reduce((totals, item) => {
      return {
        calories: totals.calories + (item.nutrition.calories || 0),
        protein: totals.protein + (item.nutrition.protein || 0),
        carbs: totals.carbs + (item.nutrition.carbs || 0),
        fats: totals.fats + (item.nutrition.fats || 0),
        fiber: totals.fiber + (item.nutrition.fiber || 0),
        sugar: totals.sugar + (item.nutrition.sugar || 0),
        sodium: totals.sodium + (item.nutrition.sodium || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mealData.foodItems.length === 0) {
      toast.error('Please add at least one food item');
      return;
    }

    try {
      setLoading(true);
      
      // Convert foodItems to the backend's meals structure
      const foodItemsForMeal = mealData.foodItems.map(item => {
        // Remove local ID and set category
        const { id: _id, ...foodItem } = item;
        return {
          ...foodItem,
          category: mealData.mealType // Set category to match mealType
        };
      });

      // Create meals object with the appropriate meal type
      const meals = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
      };
      
      // Add food items to the correct meal category
      const validMealTypes = ['breakfast', 'lunch', 'dinner'];
      if (validMealTypes.includes(mealData.mealType)) {
        meals[mealData.mealType] = foodItemsForMeal;
      } else {
        // Default to snacks if mealType is 'snack' or any other value
        meals.snacks = foodItemsForMeal;
      }

      const submissionData = {
        date: mealData.date,
        meals: meals,
        notes: mealData.notes
      };

      console.log('🚀 Submitting nutrition data:', submissionData);
      
      await nutritionService.createNutritionEntry(submissionData);
      toast.success('Meal logged successfully!');
      navigate('/nutrition');
    } catch (error) {
      console.error('❌ Failed to create nutrition entry:', error);
      toast.error(error.message || 'Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  const totalNutrition = calculateTotalNutrition();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log New Meal</h1>
        <p className="text-gray-600">Track your nutrition intake</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meal Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Meal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                value={mealData.mealType}
                onChange={(e) => setMealData(prev => ({ ...prev, mealType: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={mealData.date}
                onChange={(e) => setMealData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                value={mealData.notes}
                onChange={(e) => setMealData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional notes..."
              />
            </div>
          </div>
        </div>

        {/* Food Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Food Items</h2>
            <button
              type="button"
              onClick={() => setShowFoodForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Food
            </button>
          </div>

          {/* Food Items List */}
          {mealData.foodItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No food items added yet. Click "Add Food" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mealData.foodItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.brand && <p className="text-sm text-gray-600">{item.brand}</p>}
                      <p className="text-sm text-gray-500">
                        {item.quantity.value} {item.quantity.unit}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>{Math.round(item.nutrition.calories)} cal</span>
                        <span>P: {Math.round(item.nutrition.protein)}g</span>
                        <span>C: {Math.round(item.nutrition.carbs)}g</span>
                        <span>F: {Math.round(item.nutrition.fats)}g</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFoodItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nutrition Summary */}
        {mealData.foodItems.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Nutrition Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{Math.round(totalNutrition.calories)}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(totalNutrition.protein)}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{Math.round(totalNutrition.carbs)}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(totalNutrition.fats)}g</div>
                <div className="text-sm text-gray-600">Fats</div>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/nutrition')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || mealData.foodItems.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging...' : 'Log Meal'}
          </button>
        </div>
      </form>

      {/* Add Food Modal */}
      {showFoodForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Add Food Item</h3>
                <button
                  onClick={() => setShowFoodForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Common Foods */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Add - Common Foods</h4>
                <div className="grid grid-cols-2 gap-2">
                  {commonFoods.map((food, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectCommonFood(food)}
                      className="text-left p-2 border border-gray-200 rounded hover:bg-gray-50"
                    >
                      <div className="font-medium">{food.name}</div>
                      <div className="text-xs text-gray-500">{food.nutrition.calories} cal/100g</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Entry */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Manual Entry</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Food Name *
                    </label>
                    <input
                      type="text"
                      value={currentFood.name}
                      onChange={(e) => setCurrentFood(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., Grilled Chicken"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand (optional)
                    </label>
                    <input
                      type="text"
                      value={currentFood.brand}
                      onChange={(e) => setCurrentFood(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., Brand name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={currentFood.quantity.value}
                      onChange={(e) => setCurrentFood(prev => ({
                        ...prev,
                        quantity: { ...prev.quantity, value: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={currentFood.quantity.unit}
                      onChange={(e) => setCurrentFood(prev => ({
                        ...prev,
                        quantity: { ...prev.quantity, unit: e.target.value }
                      }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Nutrition (per 100g/100ml)
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Calories</label>
                      <input
                        type="number"
                        min="0"
                        value={currentFood.nutrition.calories}
                        onChange={(e) => setCurrentFood(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, calories: parseFloat(e.target.value) || 0 }
                        }))}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Protein (g)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={currentFood.nutrition.protein}
                        onChange={(e) => setCurrentFood(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, protein: parseFloat(e.target.value) || 0 }
                        }))}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Carbs (g)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={currentFood.nutrition.carbs}
                        onChange={(e) => setCurrentFood(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, carbs: parseFloat(e.target.value) || 0 }
                        }))}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Fats (g)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={currentFood.nutrition.fats}
                        onChange={(e) => setCurrentFood(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, fats: parseFloat(e.target.value) || 0 }
                        }))}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowFoodForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addFoodItem}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Food
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewMeal;