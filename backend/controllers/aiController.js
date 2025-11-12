import OpenAI from 'openai';
import User from '../models/User.js';

// Initialize OpenAI only if API key is provided
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('OpenAI initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize OpenAI:', error.message);
    openai = null;
  }
} else {
  console.warn('OPENAI_API_KEY not configured properly. AI features will use fallback responses.');
}

// AI Chat Controller
export const aiChat = async (req, res) => {
  try {
    const { message, userProfile } = req.body;
    const userId = req.user.id;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Check if OpenAI is available
    if (!openai) {
      const fallbackResponse = generateFallbackResponse(message, userProfile);
      return res.json({
        response: fallbackResponse,
        suggestions: generateFollowUpSuggestions(message, userProfile)
      });
    }

    // Build context from user profile
    let context = "You are an expert fitness coach and nutritionist. ";
    if (userProfile) {
      context += `User profile: `;
      if (userProfile.age) context += `Age: ${userProfile.age}, `;
      if (userProfile.gender) context += `Gender: ${userProfile.gender}, `;
      if (userProfile.fitnessGoal) context += `Goal: ${userProfile.fitnessGoal}, `;
      if (userProfile.activityLevel) context += `Activity Level: ${userProfile.activityLevel}. `;
    }
    context += "Provide helpful, accurate fitness and nutrition advice. Keep responses concise but informative.";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: context },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const response = completion.choices[0]?.message?.content;

    // Generate follow-up suggestions
    const suggestions = generateFollowUpSuggestions(message, userProfile);

    res.json({
      response: response || "I couldn't generate a response. Please try again.",
      suggestions
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Fallback responses when OpenAI is not available
    const fallbackResponse = generateFallbackResponse(req.body.message, req.body.userProfile);
    
    res.json({
      response: fallbackResponse,
      suggestions: generateFollowUpSuggestions(req.body.message, req.body.userProfile)
    });
  }
};

// AI Meal Plan Generator
export const generateMealPlan = async (req, res) => {
  try {
    const { goal, dietaryPreference, targetCalories } = req.body;
    const userId = req.user.id;

    // Use fallback if no OpenAI
    if (!openai) {
      const fallbackPlan = generateFallbackMealPlan(goal, targetCalories);
      return res.json({
        mealPlan: fallbackPlan,
        detailedPlan: parseMealPlan(fallbackPlan)
      });
    }

    const prompt = `Create a detailed daily meal plan for someone with:
    - Fitness Goal: ${goal || 'general health'}
    - Dietary Preference: ${dietaryPreference || 'omnivore'}
    - Target Calories: ${targetCalories || 2000} per day
    
    Please provide:
    1. Breakfast, Lunch, Dinner, and 2 snacks
    2. Approximate calories for each meal
    3. Brief preparation notes
    4. Macro breakdown (protein, carbs, fats)
    
    Format the response clearly with meal names and details.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a certified nutritionist creating meal plans." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const mealPlan = completion.choices[0]?.message?.content;

    // Parse the meal plan into structured data
    const detailedPlan = parseMealPlan(mealPlan);

    res.json({
      mealPlan: mealPlan || generateFallbackMealPlan(goal, targetCalories),
      detailedPlan
    });

  } catch (error) {
    console.error('Meal Plan Generation Error:', error);
    
    const fallbackPlan = generateFallbackMealPlan(req.body.goal, req.body.targetCalories);
    res.json({
      mealPlan: fallbackPlan,
      detailedPlan: parseMealPlan(fallbackPlan)
    });
  }
};

// AI Workout Plan Generator
export const generateWorkoutPlan = async (req, res) => {
  try {
    const { fitnessLevel, goal, timeAvailable, equipment } = req.body;
    const userId = req.user.id;

    // Use fallback if no OpenAI
    if (!openai) {
      const fallbackPlan = generateFallbackWorkoutPlan(goal, fitnessLevel);
      return res.json({
        workoutPlan: fallbackPlan,
        detailedPlan: parseWorkoutPlan(fallbackPlan)
      });
    }

    const prompt = `Create a workout plan for:
    - Fitness Level: ${fitnessLevel || 'beginner'}
    - Goal: ${goal || 'general fitness'}
    - Time Available: ${timeAvailable || '30 minutes'}
    - Equipment: ${equipment || 'bodyweight only'}
    
    Please provide:
    1. Warm-up (5 minutes)
    2. Main workout with specific exercises, sets, and reps
    3. Cool-down (5 minutes)
    4. Exercise modifications for different levels
    5. Safety tips
    
    Format clearly with exercise names and instructions.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a certified personal trainer creating workout plans." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const workoutPlan = completion.choices[0]?.message?.content;

    // Parse the workout plan into structured data
    const detailedPlan = parseWorkoutPlan(workoutPlan);

    res.json({
      workoutPlan: workoutPlan || generateFallbackWorkoutPlan(goal, fitnessLevel),
      detailedPlan
    });

  } catch (error) {
    console.error('Workout Plan Generation Error:', error);
    
    const fallbackPlan = generateFallbackWorkoutPlan(req.body.goal, req.body.fitnessLevel);
    res.json({
      workoutPlan: fallbackPlan,
      detailedPlan: parseWorkoutPlan(fallbackPlan)
    });
  }
};

// Mood-based Workout Recommender
export const moodBasedWorkout = async (req, res) => {
  try {
    const { mood, duration } = req.body;
    const userId = req.user.id;

    const moodWorkouts = {
      tired: {
        type: 'gentle',
        suggestions: ['Light yoga', 'Walking', 'Gentle stretching', 'Meditation'],
        description: 'Low-intensity activities to boost energy without exhaustion'
      },
      energetic: {
        type: 'high-intensity',
        suggestions: ['HIIT workout', 'Running', 'Dance workout', 'Boxing'],
        description: 'High-energy workouts to channel your enthusiasm'
      },
      stressed: {
        type: 'calming',
        suggestions: ['Yoga', 'Pilates', 'Swimming', 'Nature walk'],
        description: 'Stress-relieving activities to help you unwind'
      },
      sad: {
        type: 'mood-boosting',
        suggestions: ['Dancing', 'Group fitness class', 'Outdoor activities', 'Martial arts'],
        description: 'Endorphin-boosting activities to improve mood'
      },
      motivated: {
        type: 'challenging',
        suggestions: ['Strength training', 'CrossFit', 'Rock climbing', 'Intense cardio'],
        description: 'Challenging workouts to match your motivation'
      }
    };

    const recommendation = moodWorkouts[mood.toLowerCase()] || moodWorkouts.energetic;

    res.json({
      mood,
      recommendation: {
        type: recommendation.type,
        workouts: recommendation.suggestions,
        description: recommendation.description,
        duration: duration || '30 minutes'
      }
    });

  } catch (error) {
    console.error('Mood-based workout error:', error);
    res.status(500).json({ message: 'Failed to generate mood-based workout recommendation' });
  }
};

// AI Progress Summary Generator
export const generateProgressSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = 'week' } = req.body;

    // Fetch user's workout and nutrition data for the timeframe
    const user = await User.findById(userId);
    
    // Use fallback if no OpenAI
    if (!openai) {
      const fallbackSummary = `You're making great progress on your fitness journey! This ${timeframe}, you've been consistently working towards your goals. Keep up the excellent work and remember that consistency is key to success. Your dedication is paying off - stay motivated and continue building these healthy habits!`;
      return res.json({ 
        summary: fallbackSummary, 
        timeframe 
      });
    }
    
    const prompt = `Generate a motivational progress summary for a user who has:
    - Completed [X] workouts this ${timeframe}
    - Burned [X] calories
    - Achieved [X]% of their goals
    - Primary focus: ${user.profile?.fitnessGoal || 'general fitness'}
    
    Make it encouraging and provide specific next steps for improvement.
    Keep it under 150 words and write in second person.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a motivational fitness coach providing progress summaries." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.8
    });

    const summary = completion.choices[0]?.message?.content || 
      "You're making great progress! Keep up the excellent work and stay consistent with your fitness journey.";

    res.json({ summary, timeframe });

  } catch (error) {
    console.error('Progress summary error:', error);
    res.json({ 
      summary: "You're doing great! Keep pushing towards your fitness goals and remember that consistency is key to success.",
      timeframe: req.body.timeframe || 'week' 
    });
  }
};

// Helper Functions
function generateFollowUpSuggestions(message, userProfile) {
  const suggestions = [];
  
  if (message.toLowerCase().includes('workout')) {
    suggestions.push('How many days per week should I exercise?');
    suggestions.push('What exercises are best for beginners?');
  }
  
  if (message.toLowerCase().includes('nutrition') || message.toLowerCase().includes('diet')) {
    suggestions.push('How much protein should I eat daily?');
    suggestions.push('What are healthy snack options?');
  }
  
  if (message.toLowerCase().includes('weight')) {
    suggestions.push('How fast is healthy weight loss?');
    suggestions.push('Should I track my calories?');
  }
  
  return suggestions.slice(0, 3); // Return max 3 suggestions
}

function generateFallbackResponse(message, userProfile) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('workout')) {
    return "For a great workout, try combining cardio and strength training. Start with 30 minutes, 3-4 times per week. Include exercises like squats, push-ups, and planks for full-body fitness.";
  }
  
  if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet')) {
    return "Focus on whole foods: lean proteins, vegetables, fruits, whole grains, and healthy fats. Stay hydrated and eat regular, balanced meals. Portion control is key for weight management.";
  }
  
  if (lowerMessage.includes('weight loss')) {
    return "Healthy weight loss combines a balanced diet with regular exercise. Aim for 1-2 pounds per week through a moderate calorie deficit. Stay consistent and be patient with your progress.";
  }
  
  return "I'm here to help with your fitness journey! Feel free to ask about workouts, nutrition, goal setting, or any other health-related topics.";
}

function generateFallbackMealPlan(goal, calories) {
  return `Daily Meal Plan (${calories} calories):

Breakfast (400 calories):
- Oatmeal with berries and nuts
- Greek yogurt

Lunch (500 calories):
- Grilled chicken salad
- Quinoa
- Mixed vegetables

Dinner (500 calories):
- Baked salmon
- Sweet potato
- Steamed broccoli

Snack 1 (200 calories):
- Apple with almond butter

Snack 2 (200 calories):
- Protein smoothie

This plan supports your goal of ${goal} with balanced macronutrients.`;
}

function generateFallbackWorkoutPlan(goal, level) {
  return `Workout Plan for ${goal} (${level} level):

Warm-up (5 minutes):
- Light jogging or marching in place
- Arm circles and leg swings

Main Workout (25 minutes):
- Squats: 3 sets of 12-15
- Push-ups: 3 sets of 8-12
- Plank: 3 sets of 30 seconds
- Lunges: 3 sets of 10 per leg

Cool-down (5 minutes):
- Static stretching
- Deep breathing

Perform this routine 3 times per week with rest days in between.`;
}

function parseMealPlan(mealPlan) {
  // Simple parsing - in a real app, you'd use more sophisticated parsing
  return {
    meals: ['Breakfast', 'Lunch', 'Dinner'],
    snacks: ['Snack 1', 'Snack 2'],
    totalCalories: 2000 // This would be calculated from the parsed content
  };
}

function parseWorkoutPlan(workoutPlan) {
  // Simple parsing - in a real app, you'd use more sophisticated parsing
  return {
    warmup: '5 minutes',
    mainWorkout: '25 minutes',
    cooldown: '5 minutes',
    totalDuration: '35 minutes'
  };
}