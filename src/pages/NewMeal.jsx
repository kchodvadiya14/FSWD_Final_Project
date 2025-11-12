import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nutritionService } from '../services/userService';
import { searchFood, getFoodByKey, calculateNutrition, getFoodSuggestionsByMeal } from '../services/foodDatabase';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  XMarkIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FireIcon,
  BeakerIcon,
  SparklesIcon,
  ArrowLeftIcon
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFoodKey, setSelectedFoodKey] = useState('');
  const [mealSuggestions, setMealSuggestions] = useState([]);

  const units = [
    'grams', 'kg', 'ml', 'liters', 'cups', 'pieces', 
    'tablespoons', 'teaspoons', 'ounces', 'slices'
  ];

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  // Load meal suggestions when meal type changes
  useEffect(() => {
    const suggestions = getFoodSuggestionsByMeal(mealData.mealType);
    setMealSuggestions(suggestions);
  }, [mealData.mealType]);

  // Handle food search
  const handleFoodSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = searchFood(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Select food from search results
  const selectFood = (foodKey, foodData) => {
    setSelectedFoodKey(foodKey);
    setCurrentFood(prev => ({
      ...prev,
      name: foodData.name,
      nutrition: { ...foodData.nutrition }
    }));
    
    // Auto-calculate nutrition for current quantity
    updateNutritionForQuantity(foodKey, currentFood.quantity.value, currentFood.quantity.unit);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Update nutrition when quantity or unit changes
  const updateNutritionForQuantity = (foodKey, quantity, unit) => {
    if (!foodKey) return;
    
    const calculated = calculateNutrition(foodKey, quantity, unit);
    if (calculated) {
      setCurrentFood(prev => ({
        ...prev,
        nutrition: calculated.nutrition
      }));
    }
  };

  // Handle quantity change
  const handleQuantityChange = (value, unit) => {
    const newQuantity = { value: parseFloat(value) || 0, unit };
    setCurrentFood(prev => ({
      ...prev,
      quantity: newQuantity
    }));
    
    if (selectedFoodKey) {
      updateNutritionForQuantity(selectedFoodKey, newQuantity.value, newQuantity.unit);
    }
  };

  const addFoodItem = () => {
    if (!currentFood.name.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    if (currentFood.quantity.value <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Use already calculated nutrition from the food database
    const newFoodItem = {
      ...currentFood,
      id: Date.now(),
      foodKey: selectedFoodKey
    };

    setMealData(prev => ({
      ...prev,
      foodItems: [...prev.foodItems, newFoodItem]
    }));

    // Reset form
    resetFoodForm();
    toast.success('Food item added successfully!');
  };

  const resetFoodForm = () => {
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
    setSelectedFoodKey('');
    setSearchQuery('');
    setSearchResults([]);
    setShowFoodForm(false);
  };

  const removeFoodItem = (id) => {
    setMealData(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter(item => item.id !== id)
    }));
    toast.success('Food item removed');
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
    }, {
      calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mealData.foodItems.length === 0) {
      toast.error('Please add at least one food item');
      return;
    }

    try {
      setLoading(true);
      const totalNutrition = calculateTotalNutrition();
      
      const mealToSave = {
        ...mealData,
        totalNutrition,
        createdAt: new Date().toISOString()
      };

      await nutritionService.createOrUpdateNutritionEntry(mealToSave);
      toast.success('Meal logged successfully!');
      navigate('/nutrition');
    } catch (error) {
      console.error('Error saving meal:', error);
      toast.error('Failed to save meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalNutrition = calculateTotalNutrition();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/nutrition')}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log New Meal</h1>
          <p className="text-gray-600">Track your nutrition with automatic calorie calculation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Meal Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Meal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                value={mealData.mealType}
                onChange={(e) => setMealData(prev => ({ ...prev, mealType: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {mealTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <input
                type="text"
                value={mealData.notes}
                onChange={(e) => setMealData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Any notes about this meal..."
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
              <BeakerIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No food items added yet. Click "Add Food" to get started.</p>
              <p className="text-sm mt-1">Search our database for automatic calorie calculation!</p>
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
                        <span className="flex items-center gap-1">
                          <FireIcon className="h-3 w-3" />
                          {Math.round(item.nutrition.calories)} cal
                        </span>
                        <span>P: {Math.round(item.nutrition.protein)}g</span>
                        <span>C: {Math.round(item.nutrition.carbs)}g</span>
                        <span>F: {Math.round(item.nutrition.fats)}g</span>
                        {item.nutrition.fiber > 0 && <span>Fiber: {Math.round(item.nutrition.fiber)}g</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFoodItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
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
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <BeakerIcon className="h-5 w-5" />
              Total Nutrition
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-orange-600 text-sm font-medium">Calories</div>
                <div className="text-2xl font-bold text-orange-900">{Math.round(totalNutrition.calories)}</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="text-blue-600 text-sm font-medium">Protein</div>
                <div className="text-2xl font-bold text-blue-900">{Math.round(totalNutrition.protein)}g</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="text-green-600 text-sm font-medium">Carbs</div>
                <div className="text-2xl font-bold text-green-900">{Math.round(totalNutrition.carbs)}g</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-yellow-600 text-sm font-medium">Fats</div>
                <div className="text-2xl font-bold text-yellow-900">{Math.round(totalNutrition.fats)}g</div>
              </div>
            </div>
            {(totalNutrition.fiber > 0 || totalNutrition.sodium > 0) && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {totalNutrition.fiber > 0 && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="text-purple-600 text-sm font-medium">Fiber</div>
                    <div className="text-xl font-bold text-purple-900">{Math.round(totalNutrition.fiber)}g</div>
                  </div>
                )}
                {totalNutrition.sodium > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="text-gray-600 text-sm font-medium">Sodium</div>
                    <div className="text-xl font-bold text-gray-900">{Math.round(totalNutrition.sodium)}mg</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/nutrition')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || mealData.foodItems.length === 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Meal'}
          </button>
        </div>
      </form>

      {/* Enhanced Food Form Modal */}
      {showFoodForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Add Food Item</h3>
                <button
                  onClick={resetFoodForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Meal Type Suggestions */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-indigo-500" />
                  Suggested for {mealData.mealType}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {mealSuggestions.slice(0, 6).map((food, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectFood(food.key, food)}
                      className="text-left p-3 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{food.name}</div>
                      <div className="text-xs text-indigo-600">{food.nutrition.calories} cal/100g • {food.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Search */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Search Foods</h4>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleFoodSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search for foods... (e.g., chicken, rice, banana)"
                  />
                </div>
                
                {searchResults.length > 0 && (
                  <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                    {searchResults.map((food, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectFood(food.key, food)}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{food.name}</div>
                        <div className="text-sm text-gray-500">
                          {food.nutrition.calories} cal | {food.category}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Food Details */}
              {currentFood.name && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900">Selected: {currentFood.name}</h4>
                  
                  {/* Quantity Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={currentFood.quantity.value}
                        onChange={(e) => handleQuantityChange(e.target.value, currentFood.quantity.unit)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit
                      </label>
                      <select
                        value={currentFood.quantity.unit}
                        onChange={(e) => handleQuantityChange(currentFood.quantity.value, e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Brand (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand (optional)
                    </label>
                    <input
                      type="text"
                      value={currentFood.brand}
                      onChange={(e) => setCurrentFood(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Brand name"
                    />
                  </div>

                  {/* Calculated Nutrition Display */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Nutrition Information</h5>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-orange-600 font-medium">Calories</div>
                        <div className="text-lg font-bold text-gray-900">{Math.round(currentFood.nutrition.calories || 0)}</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-blue-600 font-medium">Protein</div>
                        <div className="text-lg font-bold text-gray-900">{Math.round(currentFood.nutrition.protein || 0)}g</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-green-600 font-medium">Carbs</div>
                        <div className="text-lg font-bold text-gray-900">{Math.round(currentFood.nutrition.carbs || 0)}g</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-yellow-600 font-medium">Fats</div>
                        <div className="text-lg font-bold text-gray-900">{Math.round(currentFood.nutrition.fats || 0)}g</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-purple-600 font-medium">Fiber</div>
                        <div className="text-lg font-bold text-gray-900">{Math.round(currentFood.nutrition.fiber || 0)}g</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-gray-600 font-medium">Sodium</div>
                        <div className="text-lg font-bold text-gray-900">{Math.round(currentFood.nutrition.sodium || 0)}mg</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetFoodForm}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addFoodItem}
                  disabled={!currentFood.name}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Food Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewMeal;