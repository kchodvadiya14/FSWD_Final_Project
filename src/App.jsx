import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
<<<<<<< Updated upstream
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
=======
import ErrorBoundary from './components/ErrorBoundary';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading NutriFit...</p>
    </div>
>>>>>>> Stashed changes
  </div>
);

// Lazy load components with fallbacks
const AuthProvider = lazy(() => 
  import('./context/AuthContext').then(module => ({ default: module.AuthProvider })).catch(() => ({ default: () => null }))
);
const AIProvider = lazy(() => 
  import('./context/AIContext').then(module => ({ default: module.AIProvider })).catch(() => ({ default: ({ children }) => children }))
);
const ProtectedRoute = lazy(() => 
  import('./components/ProtectedRoute').then(module => ({ default: module.default })).catch(() => ({ default: ({ children }) => children }))
);
const PublicRoute = lazy(() => 
  import('./components/ProtectedRoute').then(module => ({ default: module.PublicRoute })).catch(() => ({ default: ({ children }) => children }))
);
const Layout = lazy(() => 
  import('./components/Layout/Layout').catch(() => ({ default: () => <div>Layout Error</div> }))
);

// Lazy load pages
const Login = lazy(() => import('./pages/Login').catch(() => ({ default: () => <div>Login Page Error</div> })));
const Register = lazy(() => import('./pages/Register').catch(() => ({ default: () => <div>Register Page Error</div> })));
const Dashboard = lazy(() => import('./pages/Dashboard').catch(() => ({ default: () => <div>Dashboard Error</div> })));
const Workouts = lazy(() => import('./pages/Workouts').catch(() => ({ default: () => <div>Workouts Error</div> })));
const Nutrition = lazy(() => import('./pages/Nutrition').catch(() => ({ default: () => <div>Nutrition Error</div> })));
const HealthMetrics = lazy(() => import('./pages/HealthMetrics').catch(() => ({ default: () => <div>Health Metrics Error</div> })));
const Progress = lazy(() => import('./pages/Progress').catch(() => ({ default: () => <div>Progress Error</div> })));
const Profile = lazy(() => import('./pages/Profile').catch(() => ({ default: () => <div>Profile Error</div> })));
const Settings = lazy(() => import('./pages/Settings').catch(() => ({ default: () => <div>Settings Error</div> })));
const AIChat = lazy(() => import('./pages/AIChat').catch(() => ({ default: () => <div>AI Chat Error</div> })));
const Goals = lazy(() => import('./pages/Goals').catch(() => ({ default: () => <div>Goals Error</div> })));
const NewMeal = lazy(() => import('./pages/NewMeal').catch(() => ({ default: () => <div>New Meal Error</div> })));
const NewWorkout = lazy(() => import('./pages/NewWorkout').catch(() => ({ default: () => <div>New Workout Error</div> })));

function App() {
  return (
<<<<<<< Updated upstream
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
=======
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <AuthProvider>
            <AIProvider>
              <div className="App">
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#1f2937',
                      color: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #374151',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
                
                <Suspense fallback={<LoadingSpinner />}>
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
                      path="/*" 
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="workouts" element={<Workouts />} />
                      <Route path="workouts/new" element={<NewWorkout />} />
                      <Route path="nutrition" element={<Nutrition />} />
                      <Route path="nutrition/new" element={<NewMeal />} />
                      <Route path="health" element={<HealthMetrics />} />
                      <Route path="progress" element={<Progress />} />
                      <Route path="goals" element={<Goals />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="ai-coach" element={<AIChat />} />
                    </Route>
                  </Routes>
                </Suspense>
              </div>
            </AIProvider>
          </AuthProvider>
        </Suspense>
      </Router>
    </ErrorBoundary>
>>>>>>> Stashed changes
  );
}

export default App;