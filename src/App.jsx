import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import DebugAuth from './components/DebugAuth';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Placeholder components for routes that aren't implemented yet
const PlaceholderPage = ({ title }) => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600">This page is coming soon!</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
          
          {/* Debug component - remove in production */}
          <DebugAuth />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
            </Route>

            <Route 
              path="/workouts" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PlaceholderPage title="Workouts" />} />
              <Route path="new" element={<PlaceholderPage title="New Workout" />} />
            </Route>

            <Route 
              path="/nutrition" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PlaceholderPage title="Nutrition" />} />
              <Route path="new" element={<PlaceholderPage title="Log Meal" />} />
            </Route>

            <Route 
              path="/health" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PlaceholderPage title="Health Metrics" />} />
              <Route path="weight" element={<PlaceholderPage title="Weight Tracking" />} />
            </Route>

            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PlaceholderPage title="Progress" />} />
            </Route>

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PlaceholderPage title="Profile" />} />
            </Route>

            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PlaceholderPage title="Settings" />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
