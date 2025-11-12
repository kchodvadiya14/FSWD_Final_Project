// Comprehensive Food Database with Nutritional Information
// All values are per 100g unless specified otherwise

export const foodDatabase = {
  // Proteins
  "chicken breast": {
    name: "Chicken Breast (skinless)",
    category: "protein",
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fats: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74
    },
    commonServings: [
      { name: "1 medium breast (150g)", multiplier: 1.5 },
      { name: "1 cup diced (140g)", multiplier: 1.4 }
    ]
  },
  "salmon": {
    name: "Salmon (Atlantic, farmed)",
    category: "protein",
    nutrition: {
      calories: 208,
      protein: 25,
      carbs: 0,
      fats: 12,
      fiber: 0,
      sugar: 0,
      sodium: 44
    },
    commonServings: [
      { name: "1 fillet (150g)", multiplier: 1.5 }
    ]
  },
  "eggs": {
    name: "Eggs (large)",
    category: "protein",
    nutrition: {
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fats: 11,
      fiber: 0,
      sugar: 1.1,
      sodium: 124
    },
    commonServings: [
      { name: "1 large egg (50g)", multiplier: 0.5 },
      { name: "2 large eggs (100g)", multiplier: 1 }
    ]
  },
  "greek yogurt": {
    name: "Greek Yogurt (plain, non-fat)",
    category: "protein",
    nutrition: {
      calories: 130,
      protein: 11,
      carbs: 9,
      fats: 5,
      fiber: 0,
      sugar: 9,
      sodium: 50
    },
    commonServings: [
      { name: "1 cup (245g)", multiplier: 2.45 },
      { name: "1/2 cup (123g)", multiplier: 1.23 }
    ]
  },

  // Carbohydrates
  "brown rice": {
    name: "Brown Rice (cooked)",
    category: "carbs",
    nutrition: {
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fats: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5
    },
    commonServings: [
      { name: "1 cup cooked (195g)", multiplier: 1.95 },
      { name: "1/2 cup cooked (98g)", multiplier: 0.98 }
    ]
  },
  "white rice": {
    name: "White Rice (cooked)",
    category: "carbs",
    nutrition: {
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fats: 0.3,
      fiber: 0.4,
      sugar: 0.1,
      sodium: 1
    },
    commonServings: [
      { name: "1 cup cooked (158g)", multiplier: 1.58 },
      { name: "1/2 cup cooked (79g)", multiplier: 0.79 }
    ]
  },
  "oats": {
    name: "Oats (raw)",
    category: "carbs",
    nutrition: {
      calories: 389,
      protein: 16.9,
      carbs: 66,
      fats: 6.9,
      fiber: 10.6,
      sugar: 0,
      sodium: 2
    },
    commonServings: [
      { name: "1/2 cup dry (40g)", multiplier: 0.4 },
      { name: "1 cup cooked (234g)", multiplier: 2.34 }
    ]
  },
  "quinoa": {
    name: "Quinoa (cooked)",
    category: "carbs",
    nutrition: {
      calories: 120,
      protein: 4.4,
      carbs: 22,
      fats: 1.9,
      fiber: 2.8,
      sugar: 0.9,
      sodium: 7
    },
    commonServings: [
      { name: "1 cup cooked (185g)", multiplier: 1.85 }
    ]
  },
  "sweet potato": {
    name: "Sweet Potato (baked)",
    category: "carbs",
    nutrition: {
      calories: 90,
      protein: 2,
      carbs: 21,
      fats: 0.2,
      fiber: 3.3,
      sugar: 6.8,
      sodium: 7
    },
    commonServings: [
      { name: "1 medium (128g)", multiplier: 1.28 },
      { name: "1 cup cubed (133g)", multiplier: 1.33 }
    ]
  },

  // Fruits
  "banana": {
    name: "Banana",
    category: "fruits",
    nutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fats: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1
    },
    commonServings: [
      { name: "1 medium banana (118g)", multiplier: 1.18 },
      { name: "1 large banana (136g)", multiplier: 1.36 }
    ]
  },
  "apple": {
    name: "Apple (with skin)",
    category: "fruits",
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fats: 0.2,
      fiber: 2.4,
      sugar: 10,
      sodium: 1
    },
    commonServings: [
      { name: "1 medium apple (182g)", multiplier: 1.82 },
      { name: "1 cup sliced (109g)", multiplier: 1.09 }
    ]
  },
  "blueberries": {
    name: "Blueberries",
    category: "fruits",
    nutrition: {
      calories: 57,
      protein: 0.7,
      carbs: 14,
      fats: 0.3,
      fiber: 2.4,
      sugar: 10,
      sodium: 1
    },
    commonServings: [
      { name: "1 cup (148g)", multiplier: 1.48 },
      { name: "1/2 cup (74g)", multiplier: 0.74 }
    ]
  },
  "strawberries": {
    name: "Strawberries",
    category: "fruits",
    nutrition: {
      calories: 32,
      protein: 0.7,
      carbs: 8,
      fats: 0.3,
      fiber: 2,
      sugar: 4.9,
      sodium: 1
    },
    commonServings: [
      { name: "1 cup whole (152g)", multiplier: 1.52 },
      { name: "1 cup sliced (166g)", multiplier: 1.66 }
    ]
  },

  // Vegetables
  "broccoli": {
    name: "Broccoli (cooked)",
    category: "vegetables",
    nutrition: {
      calories: 35,
      protein: 2.4,
      carbs: 7,
      fats: 0.4,
      fiber: 3.3,
      sugar: 1.9,
      sodium: 32
    },
    commonServings: [
      { name: "1 cup chopped (156g)", multiplier: 1.56 },
      { name: "1 stalk medium (148g)", multiplier: 1.48 }
    ]
  },
  "spinach": {
    name: "Spinach (raw)",
    category: "vegetables",
    nutrition: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fats: 0.4,
      fiber: 2.2,
      sugar: 0.4,
      sodium: 79
    },
    commonServings: [
      { name: "1 cup (30g)", multiplier: 0.3 },
      { name: "1 cup cooked (180g)", multiplier: 1.8 }
    ]
  },
  "carrots": {
    name: "Carrots (raw)",
    category: "vegetables",
    nutrition: {
      calories: 41,
      protein: 0.9,
      carbs: 10,
      fats: 0.2,
      fiber: 2.8,
      sugar: 4.7,
      sodium: 69
    },
    commonServings: [
      { name: "1 medium carrot (61g)", multiplier: 0.61 },
      { name: "1 cup chopped (128g)", multiplier: 1.28 }
    ]
  },

  // Nuts and Seeds
  "almonds": {
    name: "Almonds",
    category: "nuts",
    nutrition: {
      calories: 579,
      protein: 21,
      carbs: 22,
      fats: 50,
      fiber: 12,
      sugar: 4.4,
      sodium: 1
    },
    commonServings: [
      { name: "1 oz (28g)", multiplier: 0.28 },
      { name: "1/4 cup (30g)", multiplier: 0.3 }
    ]
  },
  "walnuts": {
    name: "Walnuts",
    category: "nuts",
    nutrition: {
      calories: 654,
      protein: 15,
      carbs: 14,
      fats: 65,
      fiber: 6.7,
      sugar: 2.6,
      sodium: 2
    },
    commonServings: [
      { name: "1 oz (28g)", multiplier: 0.28 },
      { name: "1/4 cup halves (30g)", multiplier: 0.3 }
    ]
  },
  "peanut butter": {
    name: "Peanut Butter (natural)",
    category: "nuts",
    nutrition: {
      calories: 588,
      protein: 25,
      carbs: 20,
      fats: 50,
      fiber: 8,
      sugar: 9,
      sodium: 17
    },
    commonServings: [
      { name: "1 tbsp (16g)", multiplier: 0.16 },
      { name: "2 tbsp (32g)", multiplier: 0.32 }
    ]
  },

  // Dairy
  "milk": {
    name: "Milk (2% fat)",
    category: "dairy",
    nutrition: {
      calories: 50,
      protein: 3.3,
      carbs: 5,
      fats: 2,
      fiber: 0,
      sugar: 5,
      sodium: 44
    },
    commonServings: [
      { name: "1 cup (244g)", multiplier: 2.44 },
      { name: "1/2 cup (122g)", multiplier: 1.22 }
    ]
  },
  "cheese cheddar": {
    name: "Cheddar Cheese",
    category: "dairy",
    nutrition: {
      calories: 403,
      protein: 25,
      carbs: 3.4,
      fats: 33,
      fiber: 0,
      sugar: 0.5,
      sodium: 653
    },
    commonServings: [
      { name: "1 oz (28g)", multiplier: 0.28 },
      { name: "1 cup shredded (113g)", multiplier: 1.13 }
    ]
  },

  // Beverages
  "orange juice": {
    name: "Orange Juice (fresh)",
    category: "beverages",
    nutrition: {
      calories: 45,
      protein: 0.7,
      carbs: 10,
      fats: 0.2,
      fiber: 0.2,
      sugar: 8.1,
      sodium: 1
    },
    commonServings: [
      { name: "1 cup (248g)", multiplier: 2.48 },
      { name: "1/2 cup (124g)", multiplier: 1.24 }
    ]
  }
};

// Search function for food database
export const searchFood = (query) => {
  const lowercaseQuery = query.toLowerCase().trim();
  
  if (!lowercaseQuery) return [];
  
  const results = [];
  
  Object.keys(foodDatabase).forEach(key => {
    const food = foodDatabase[key];
    if (key.includes(lowercaseQuery) || 
        food.name.toLowerCase().includes(lowercaseQuery)) {
      results.push({
        key,
        ...food
      });
    }
  });
  
  return results;
};

// Get food by exact key
export const getFoodByKey = (key) => {
  return foodDatabase[key.toLowerCase()] || null;
};

// Calculate nutrition for a specific quantity
export const calculateNutrition = (foodKey, quantity, unit = 'grams') => {
  const food = getFoodByKey(foodKey);
  if (!food) return null;
  
  // Convert quantity to grams (base unit)
  let quantityInGrams = quantity;
  
  // Unit conversion (simplified - in real app, you'd have a comprehensive conversion table)
  const unitConversions = {
    'kg': 1000,
    'grams': 1,
    'g': 1,
    'ml': 1, // Assumes density of 1 for liquids
    'liters': 1000,
    'cups': 240, // 1 cup = 240ml
    'tablespoons': 15,
    'teaspoons': 5,
    'ounces': 28.35,
    'oz': 28.35,
    'pounds': 453.59,
    'lbs': 453.59
  };
  
  if (unitConversions[unit.toLowerCase()]) {
    quantityInGrams = quantity * unitConversions[unit.toLowerCase()];
  }
  
  // Calculate nutrition per 100g base
  const ratio = quantityInGrams / 100;
  const calculatedNutrition = {};
  
  Object.keys(food.nutrition).forEach(nutrient => {
    calculatedNutrition[nutrient] = Math.round(food.nutrition[nutrient] * ratio * 10) / 10;
  });
  
  return {
    food: food.name,
    quantity: quantity,
    unit: unit,
    nutrition: calculatedNutrition
  };
};

// Get food suggestions based on meal type
export const getFoodSuggestionsByMeal = (mealType) => {
  const suggestions = {
    breakfast: ['oats', 'eggs', 'banana', 'greek yogurt', 'milk', 'blueberries'],
    lunch: ['chicken breast', 'brown rice', 'quinoa', 'salmon', 'sweet potato', 'broccoli'],
    dinner: ['salmon', 'chicken breast', 'quinoa', 'sweet potato', 'spinach', 'carrots'],
    snack: ['almonds', 'apple', 'greek yogurt', 'peanut butter', 'strawberries', 'carrots']
  };
  
  return (suggestions[mealType] || []).map(key => ({
    key,
    ...foodDatabase[key]
  }));
};

export default {
  foodDatabase,
  searchFood,
  getFoodByKey,
  calculateNutrition,
  getFoodSuggestionsByMeal
};