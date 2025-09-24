import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  UserIcon,
  CameraIcon,
  CalendarIcon,
  ScaleIcon,
  RulerIcon,
  HeartIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    fitnessGoals: [],
    bio: '',
    joinDate: '',
    preferences: {
      units: 'metric',
      theme: 'light',
      notifications: true
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize with user data
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        joinDate: user.createdAt || new Date().toISOString()
      }));
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      // In a real app, call API to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset changes
    setIsEditing(false);
  };

  const calculateBMI = () => {
    if (!profile.height || !profile.weight) return null;
    const heightInM = parseFloat(profile.height) / 100;
    const weightInKg = parseFloat(profile.weight);
    return (weightInKg / (heightInM * heightInM)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <PencilIcon className="h-5 w-5" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <XMarkIcon className="h-5 w-5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
            >
              <CheckIcon className="h-5 w-5" />
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-gray-400" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
                  <CameraIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="mt-4">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg font-medium text-center border border-gray-300 rounded px-2 py-1"
                  placeholder="Your name"
                />
              ) : (
                <h2 className="text-lg font-medium text-gray-900">{profile.name || 'Your Name'}</h2>
              )}
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Member since {new Date(profile.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              {bmi && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">BMI</span>
                  <span className="text-sm font-medium">{bmi} ({bmiCategory})</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Activity Level</span>
                <span className="text-sm font-medium capitalize">{profile.activityLevel || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Goals</span>
                <span className="text-sm font-medium">{profile.fitnessGoals.length || 0} active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="25"
                  />
                ) : (
                  <p className="text-gray-900">{profile.age || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile.gender || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="number"
                      value={profile.height}
                      onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="175"
                    />
                    <RulerIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                ) : (
                  <p className="text-gray-900">{profile.height ? `${profile.height} cm` : 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={profile.weight}
                      onChange={(e) => setProfile(prev => ({ ...prev, weight: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="70"
                    />
                    <ScaleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                ) : (
                  <p className="text-gray-900">{profile.weight ? `${profile.weight} kg` : 'Not set'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                </label>
                {isEditing ? (
                  <select
                    value={profile.activityLevel}
                    onChange={(e) => setProfile(prev => ({ ...prev, activityLevel: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (little to no exercise)</option>
                    <option value="light">Light (light exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                    <option value="active">Active (hard exercise 6-7 days/week)</option>
                    <option value="very_active">Very Active (very hard exercise, physical job)</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile.activityLevel?.replace('_', ' ') || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">About Me</h3>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell us about yourself, your fitness journey, goals, or anything you'd like to share..."
              />
            ) : (
              <p className="text-gray-900">
                {profile.bio || 'No bio added yet. Edit your profile to add a description about yourself.'}
              </p>
            )}
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                {isEditing ? (
                  <select
                    value={profile.preferences.units}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, units: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="metric">Metric (kg, cm, km)</option>
                    <option value="imperial">Imperial (lbs, ft, miles)</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile.preferences.units}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                {isEditing ? (
                  <select
                    value={profile.preferences.theme}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, theme: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile.preferences.theme}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Notifications</label>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, notifications: e.target.checked }
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                ) : (
                  <span className="text-gray-900">
                    {profile.preferences.notifications ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;