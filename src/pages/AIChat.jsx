import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../context/AIContext';
import { useAuth } from '../context/AuthContext';
import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AIChat = () => {
  const [message, setMessage] = useState('');
  const { aiLoading, chatHistory, askAICoach } = useAI();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || aiLoading) return;

    const currentMessage = message;
    setMessage('');

    try {
      await askAICoach(currentMessage, {
        userId: user?._id,
        profile: user?.profile,
        fitnessGoal: user?.profile?.fitnessGoal
      });
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
    }
  };

  const quickQuestions = [
    "What's the best workout for beginners?",
    "How can I lose weight effectively?",
    "What should I eat after a workout?",
    "How often should I exercise?",
    "Tips for staying motivated?",
    "How to build muscle mass?",
    "Best cardio exercises for weight loss?",
    "How to track my progress?"
  ];

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-t-2xl border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Fitness Coach</h1>
            <p className="text-gray-600">Get personalized fitness advice and support</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white p-6 overflow-y-auto">
        {chatHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to your AI Fitness Coach!</h3>
            <p className="text-gray-600 mb-6">Ask me anything about fitness, nutrition, or health. I'm here to help you achieve your goals!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-start space-x-2">
                    <LightBulbIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{question}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {chatHistory.map((chat, index) => (
              <div key={chat.id || index} className="space-y-4">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="max-w-xs lg:max-w-md px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-lg shadow-lg">
                    <p className="text-sm">{chat.question}</p>
                    <p className="text-xs text-blue-100 mt-1">
                      {new Date(chat.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-2xl px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <SparklesIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600">AI Coach</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-3 leading-relaxed">{chat.response.answer}</p>
                    
                    {chat.response.tips && chat.response.tips.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-1 mb-2">
                          <LightBulbIcon className="h-3 w-3 text-yellow-600" />
                          <p className="text-xs font-medium text-gray-700">Quick Tips:</p>
                        </div>
                        <ul className="space-y-1">
                          {chat.response.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-xs text-gray-600 flex items-start">
                              <span className="text-blue-600 mr-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(chat.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {aiLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-b-2xl border-t border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your AI coach anything..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={aiLoading}
            />
            {message && (
              <button
                type="button"
                onClick={() => setMessage('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!message.trim() || aiLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            <span>Send</span>
          </button>
        </form>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {quickQuestions.slice(0, 4).map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              disabled={aiLoading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIChat;