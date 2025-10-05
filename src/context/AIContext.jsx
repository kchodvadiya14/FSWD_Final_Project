import React, { createContext, useContext, useState } from 'react';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Simulate Gemini AI responses (replace with actual Gemini API calls)
  const generateAIResponse = async (question, context) => {
    const responses = {
      'workout': {
        answer: "Based on your fitness goal, I recommend a balanced approach. Start with 3-4 workouts per week, focusing on both strength training and cardio. Remember, consistency is more important than intensity when starting out.",
        tips: [
          "Start with bodyweight exercises if you're a beginner",
          "Always warm up for 5-10 minutes before exercising",
          "Focus on proper form rather than heavy weights",
          "Rest for 48 hours between intense sessions"
        ]
      },
      'nutrition': {
        answer: "Nutrition plays a crucial role in achieving your fitness goals. Focus on whole foods, adequate protein intake, and staying hydrated. The key is creating sustainable eating habits rather than restrictive diets.",
        tips: [
          "Aim for 0.8-1g protein per kg of body weight",
          "Include vegetables in every meal",
          "Drink at least 8 glasses of water daily",
          "Eat smaller, frequent meals throughout the day"
        ]
      },
      'weight': {
        answer: "Weight management is about creating a sustainable caloric balance. For weight loss, aim for a moderate deficit of 300-500 calories per day. For weight gain, focus on nutrient-dense foods and strength training.",
        tips: [
          "Track your progress with measurements, not just the scale",
          "Be patient - healthy weight change is 0.5-1kg per week",
          "Don't skip meals, it can slow your metabolism",
          "Focus on building muscle while managing weight"
        ]
      },
      'default': {
        answer: "I'm here to help you with your fitness journey! Whether you need workout advice, nutrition guidance, or motivation, I'll provide personalized recommendations based on your goals and current fitness level.",
        tips: [
          "Set realistic and achievable goals",
          "Track your progress regularly",
          "Listen to your body and rest when needed",
          "Celebrate small victories along the way"
        ]
      }
    };

    const questionType = question.toLowerCase().includes('workout') || question.toLowerCase().includes('exercise') ? 'workout' :
                        question.toLowerCase().includes('food') || question.toLowerCase().includes('nutrition') || question.toLowerCase().includes('diet') ? 'nutrition' :
                        question.toLowerCase().includes('weight') || question.toLowerCase().includes('lose') || question.toLowerCase().includes('gain') ? 'weight' :
                        'default';

    return responses[questionType];
  };

  const askAICoach = async (question, userContext) => {
    setAiLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await generateAIResponse(question, userContext);
      
      const newMessage = {
        id: Date.now(),
        question,
        response,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, newMessage]);
      return response;
    } catch (error) {
      console.error('AI coach failed:', error);
      throw error;
    } finally {
      setAiLoading(false);
    }
  };

  const generateWorkoutPlan = async (userProfile, preferences = {}) => {
    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const workoutPlans = {
        'lose_weight': {
          name: "Fat Burning Circuit",
          duration: 35,
          exercises: [
            { name: "Jumping Jacks", sets: 3, reps: 20, restTime: "30s" },
            { name: "Burpees", sets: 3, reps: 8, restTime: "45s" },
            { name: "Mountain Climbers", sets: 3, reps: 15, restTime: "30s" },
            { name: "Squat Jumps", sets: 3, reps: 12, restTime: "45s" },
            { name: "Push-ups", sets: 3, reps: 10, restTime: "30s" }
          ],
          caloriesBurn: 320,
          difficulty: "Intermediate"
        },
        'gain_weight': {
          name: "Muscle Building Strength",
          duration: 50,
          exercises: [
            { name: "Push-ups", sets: 4, reps: 12, restTime: "90s" },
            { name: "Squats", sets: 4, reps: 15, restTime: "90s" },
            { name: "Lunges", sets: 3, reps: 10, restTime: "60s" },
            { name: "Plank", sets: 3, duration: "45s", restTime: "60s" },
            { name: "Pull-ups", sets: 3, reps: 8, restTime: "90s" }
          ],
          caloriesBurn: 280,
          difficulty: "Intermediate"
        },
        'default': {
          name: "Full Body Fitness",
          duration: 40,
          exercises: [
            { name: "Push-ups", sets: 3, reps: 12, restTime: "60s" },
            { name: "Squats", sets: 3, reps: 15, restTime: "60s" },
            { name: "Planks", sets: 3, duration: "30s", restTime: "45s" },
            { name: "Jumping Jacks", sets: 3, reps: 20, restTime: "30s" }
          ],
          caloriesBurn: 250,
          difficulty: "Beginner"
        }
      };

      const goal = userProfile?.fitnessGoal || 'default';
      return workoutPlans[goal] || workoutPlans.default;
    } catch (error) {
      console.error('Workout generation failed:', error);
      throw error;
    } finally {
      setAiLoading(false);
    }
  };

  const generateNutritionPlan = async (userProfile, preferences = {}) => {
    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const plans = {
        'lose_weight': {
          dailyCalories: 1800,
          macros: { protein: 130, carbs: 180, fats: 60 },
          meals: [
            { name: "Breakfast", calories: 350, items: ["Greek yogurt with berries", "Almonds", "Green tea"] },
            { name: "Lunch", calories: 450, items: ["Grilled chicken salad", "Quinoa", "Olive oil dressing"] },
            { name: "Snack", calories: 200, items: ["Apple with peanut butter"] },
            { name: "Dinner", calories: 500, items: ["Baked salmon", "Steamed broccoli", "Sweet potato"] },
            { name: "Evening", calories: 300, items: ["Protein smoothie"] }
          ]
        },
        'gain_weight': {
          dailyCalories: 2800,
          macros: { protein: 200, carbs: 350, fats: 100 },
          meals: [
            { name: "Breakfast", calories: 600, items: ["Oatmeal with banana", "Protein powder", "Nuts"] },
            { name: "Lunch", calories: 700, items: ["Chicken breast", "Brown rice", "Avocado"] },
            { name: "Snack", calories: 400, items: ["Trail mix", "Greek yogurt"] },
            { name: "Dinner", calories: 650, items: ["Lean beef", "Quinoa", "Vegetables"] },
            { name: "Evening", calories: 450, items: ["Casein protein shake", "Banana"] }
          ]
        }
      };

      const goal = userProfile?.fitnessGoal || 'lose_weight';
      return plans[goal] || plans.lose_weight;
    } catch (error) {
      console.error('Nutrition generation failed:', error);
      throw error;
    } finally {
      setAiLoading(false);
    }
  };

  const value = {
    aiLoading,
    chatHistory,
    askAICoach,
    generateWorkoutPlan,
    generateNutritionPlan,
    setChatHistory
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};