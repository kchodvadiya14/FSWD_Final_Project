import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ChatBubbleLeftIcon, 
  SparklesIcon, 
  FireIcon,
  HeartIcon,
  BookOpenIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const quickQuestions = [
    {
      category: 'Workout',
      icon: FireIcon,
      questions: [
        'Suggest a 30-min beginner workout',
        'Create a HIIT workout for fat loss',
        'What exercises for building chest?',
        'Best workouts for women at home'
      ]
    },
    {
      category: 'Nutrition',
      icon: HeartIcon,
      questions: [
        'High protein meal ideas',
        'Post-workout snack suggestions',
        'Meal plan for weight loss',
        'Vegetarian protein sources'
      ]
    },
    {
      category: 'Goals',
      icon: LightBulbIcon,
      questions: [
        'How to lose 5kg in 2 months?',
        'Build muscle mass tips',
        'Improve cardio endurance',
        'Balance strength and cardio'
      ]
    }
  ];

  const sendMessage = async (message = input) => {
    if (!message.trim() || isLoading) return;

    const userMessage = { type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message,
          userProfile: {
            age: user?.profile?.age,
            gender: user?.profile?.gender,
            fitnessGoal: user?.profile?.fitnessGoal,
            activityLevel: user?.profile?.activityLevel
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = { 
          type: 'ai', 
          content: data.response, 
          timestamp: new Date(),
          suggestions: data.suggestions || []
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      toast.error('Failed to get AI response');
      const errorMessage = { 
        type: 'ai', 
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const generateMealPlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          goal: user?.profile?.fitnessGoal,
          dietaryPreference: user?.profile?.dietaryPreference || 'omnivore',
          targetCalories: user?.dailyCalorieTarget || 2000
        })
      });

      const data = await response.json();
      if (response.ok) {
        const mealPlanMessage = {
          type: 'ai',
          content: `Here's your personalized meal plan:\n\n${data.mealPlan}`,
          timestamp: new Date(),
          mealPlan: data.detailedPlan
        };
        setMessages(prev => [...prev, mealPlanMessage]);
      }
    } catch (error) {
      toast.error('Failed to generate meal plan');
    } finally {
      setIsLoading(false);
    }
  };

  const generateWorkoutPlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/workout-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fitnessLevel: user?.profile?.activityLevel,
          goal: user?.profile?.fitnessGoal,
          timeAvailable: '30-45 minutes',
          equipment: 'basic'
        })
      });

      const data = await response.json();
      if (response.ok) {
        const workoutMessage = {
          type: 'ai',
          content: `Here's your personalized workout plan:\n\n${data.workoutPlan}`,
          timestamp: new Date(),
          workoutPlan: data.detailedPlan
        };
        setMessages(prev => [...prev, workoutMessage]);
      }
    } catch (error) {
      toast.error('Failed to generate workout plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">AI Fitness Coach</h1>
            <p className="text-indigo-100">Get personalized fitness and nutrition advice powered by AI</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'chat' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ChatBubbleLeftIcon className="h-4 w-4 inline mr-2" />
          AI Chat
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'plans' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpenIcon className="h-4 w-4 inline mr-2" />
          AI Plans
        </button>
      </div>

      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Questions */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Questions</h3>
            {quickQuestions.map((category) => (
              <div key={category.category} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 mb-3">
                  <category.icon className="h-5 w-5 text-indigo-600" />
                  <h4 className="font-medium text-gray-900">{category.category}</h4>
                </div>
                <div className="space-y-2">
                  {category.questions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-96 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <SparklesIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Ask me anything about fitness, nutrition, or health!</p>
                  </div>
                )}
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap ${
                        message.type === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {message.suggestions.map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleQuickQuestion(suggestion)}
                              className="block w-full text-left text-xs bg-white bg-opacity-20 p-2 rounded hover:bg-opacity-30 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me about fitness, nutrition, or health..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Meal Plan Generator */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <HeartIcon className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold">AI Meal Plan Generator</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Generate a personalized meal plan based on your fitness goals and dietary preferences.
            </p>
            <button
              onClick={generateMealPlan}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate Meal Plan'}
            </button>
          </div>

          {/* AI Workout Plan Generator */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <FireIcon className="h-6 w-6 text-orange-600" />
              <h3 className="text-lg font-semibold">AI Workout Plan Generator</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Get a customized workout routine tailored to your fitness level and goals.
            </p>
            <button
              onClick={generateWorkoutPlan}
              disabled={isLoading}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate Workout Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;