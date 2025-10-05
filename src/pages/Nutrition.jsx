import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  FireIcon, 
  HeartIcon,
  ChartBarIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { useAI } from '../context/AIContext';
import toast from 'react-hot-toast';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 70
  });
  const [consumedToday, setConsumedToday] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    time: ''
  });

  const { generateNutritionPlan, aiLoading } = useAI();

  useEffect(() => {
    // Sample meals data
    const sampleMeals = [
      {
        id: 1,
        name: 'Greek Yogurt with Berries',
        type: 'breakfast',
        calories: 250,
        protein: 15,
        carbs: 30,
        fats: 8,
        time: '08:00',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 2,
        name: 'Grilled Chicken Salad',
        type: 'lunch',
        calories: 400,
        protein: 35,
        carbs: 20,
        fats: 15,
        time: '13:00',
        date: new Date().toISOString().split('T')[0]
      }
    ];
    setMeals(sampleMeals);

    // Calculate consumed today
    const today = new Date().toISOString().split('T')[0];
    const todaysMeals = sampleMeals.filter(meal => meal.date === today);
    
    const consumed = todaysMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    
    setConsumedToday(consumed);
  }, []);

  const handleAddMeal = (e) => {
    e.preventDefault();
    
    if (!newMeal.name || !newMeal.calories) {
      toast.error('Please fill in the required fields');
      return;
    }

    const meal = {
      id: Date.now(),
      name: newMeal.name,
      type: newMeal.type,
      calories: parseInt(newMeal.calories),
      protein: parseInt(newMeal.protein) || 0,
      carbs: parseInt(newMeal.carbs) || 0,
      fats: parseInt(newMeal.fats) || 0,
      time: newMeal.time || new Date().toTimeString().slice(0, 5),
      date: new Date().toISOString().split('T')[0]
    };

    setMeals(prev => [...prev, meal]);
    setConsumedToday(prev => ({
      calories: prev.calories + meal.calories,
      protein: prev.protein + meal.protein,
      carbs: prev.carbs + meal.carbs,
      fats: prev.fats + meal.fats
    }));

    setNewMeal({
      name: '',
      type: 'breakfast',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      time: ''
    });

    setShowAddForm(false);
    toast.success('Meal logged successfully!');
  };

  const generateAINutritionPlan = async () => {
    try {
      const plan = await generateNutritionPlan({
        fitnessGoal: 'lose_weight',
        dailyCalories: dailyGoals.calories
      });
      
      toast.success('AI nutrition plan generated!');
      // You can display the plan in a modal or new section
      console.log('Generated plan:', plan);
    } catch (error) {
      toast.error('Failed to generate nutrition plan');
    }
  };

  const getProgressPercentage = (consumed, goal) => {
    return goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;
  };

  const macroCards = [
    {
      name: 'Calories',
      consumed: consumedToday.calories,
      goal: dailyGoals.calories,
      icon: FireIcon,
      color: 'red',
      unit: 'cal'
    },
    {
      name: 'Protein',
      consumed: consumedToday.protein,
      goal: dailyGoals.protein,
      icon: ChartBarIcon,
      color: 'blue',
      unit: 'g'
    },
    {
      name: 'Carbs',
      consumed: consumedToday.carbs,
      goal: dailyGoals.carbs,
      icon: HeartIcon,
      color: 'green',
      unit: 'g'
    },
    {
      name: 'Fats',
      consumed: consumedToday.fats,
      goal: dailyGoals.fats,
      icon: ChartBarIcon,
      color: 'yellow',
      unit: 'g'
    }
  ];

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nutrition</h1>
          <p className="text-gray-600">Track your meals and reach your nutrition goals</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateAINutritionPlan}
            disabled={aiLoading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {aiLoading ? 'Generating...' : '✨ AI Meal Plan'}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Log Meal</span>
          </button>
        </div>
      </div>

      {/* Macro Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {macroCards.map((macro) => {
          const percentage = getProgressPercentage(macro.consumed, macro.goal);
          return (
            <div key={macro.name} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${macro.color}-100 rounded-xl flex items-center justify-center`}>
                  <macro.icon className={`h-6 w-6 text-${macro.color}-600`} />
                </div>
                <span className="text-sm font-medium text-gray-600">{percentage.toFixed(0)}%</span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{macro.name}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {macro.consumed} <span className="text-sm font-normal text-gray-500">/ {macro.goal} {macro.unit}</span>
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r from-${macro.color}-500 to-${macro.color}-600 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meals by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mealTypes.map((type) => {
          const typeMeals = meals.filter(meal => 
            meal.type === type && 
            meal.date === new Date().toISOString().split('T')[0]
          );
          
          return (
            <div key={type} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                {type}
              </h3>
              
              {typeMeals.length > 0 ? (
                <div className="space-y-3">
                  {typeMeals.map((meal) => (
                    <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{meal.name}</p>
                        <p className="text-sm text-gray-600">
                          {meal.time} • {meal.calories} cal
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>P: {meal.protein}g</p>
                        <p>C: {meal.carbs}g</p>
                        <p>F: {meal.fats}g</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-gray-500 mt-2">No {type} logged yet</p>
                  <button
                    onClick={() => {
                      setNewMeal({...newMeal, type});
                      setShowAddForm(true);
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Add {type}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Meal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Meal</h3>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name *</label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Grilled Chicken Breast"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                  <select
                    value={newMeal.type}
                    onChange={(e) => setNewMeal({...newMeal, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newMeal.time}
                    onChange={(e) => setNewMeal({...newMeal, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories *</label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={newMeal.fats}
                    onChange={(e) => setNewMeal({...newMeal, fats: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Log Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;