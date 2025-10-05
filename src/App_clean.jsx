import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AIProvider } from './context/AIContext';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import HealthCheck from './components/HealthCheck';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import HealthMetrics from './pages/HealthMetrics';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AIChat from './pages/AIChat';

function App() {
  // Simple test to check if React is working
  return (
    <div className="App">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
              🏋️‍♂️ NutriFit Application Test
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">✅ Frontend Status</h2>
              <p className="text-green-600 font-medium">React frontend is loading successfully!</p>
              <p className="text-gray-600 mt-2">Current time: {new Date().toLocaleTimeString()}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔗 Backend Connection Test</h2>
              <HealthCheck />
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">🚀 Quick Links</h3>
              <div className="space-y-2">
                <p><strong>Frontend:</strong> <a href="http://localhost:5174" className="text-blue-600 underline">http://localhost:5174</a></p>
                <p><strong>Backend API:</strong> <a href="http://localhost:5001/api/health" className="text-blue-600 underline">http://localhost:5001/api/health</a></p>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">🔧 Troubleshooting</h3>
              <div className="space-y-2 text-sm text-yellow-700">
                <p>• Check that both backend (port 5001) and frontend (port 5174) servers are running</p>
                <p>• Open browser developer tools (F12) to check for JavaScript errors</p>
                <p>• Verify network connectivity by clicking the backend API link above</p>
                <p>• If still having issues, try refreshing the page or clearing browser cache</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;