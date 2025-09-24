import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import fitnessDataManager from '../services/fitnessDataManager';
import {
  CameraIcon,
  CalendarIcon,
  ScaleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrophyIcon,
  FireIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      const userData = fitnessDataManager.getUser();
      // Flatten the nested profile structure for the component
      const flattenedProfile = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        joinDate: userData.joinDate,
        age: userData.profile?.age,
        gender: userData.profile?.gender,
        height: userData.profile?.height,
        weight: userData.profile?.weight,
        targetWeight: userData.profile?.targetWeight,
        activityLevel: userData.profile?.activityLevel,
        fitnessGoals: userData.profile?.fitnessGoals || [],
        dailyCalorieTarget: userData.profile?.dailyCalorieTarget,
        dailyWaterTarget: userData.profile?.dailyWaterTarget,
        preferences: userData.preferences || {}
      };
      setProfile(flattenedProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile({}); // Set empty object to avoid infinite loading
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setProfile(prev => ({ ...prev, profilePicture: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Convert flattened profile back to nested structure for saving
      const nestedUserData = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        joinDate: profile.joinDate,
        profile: {
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          targetWeight: profile.targetWeight,
          activityLevel: profile.activityLevel,
          fitnessGoals: profile.fitnessGoals,
          dailyCalorieTarget: profile.dailyCalorieTarget,
          dailyWaterTarget: profile.dailyWaterTarget
        },
        preferences: profile.preferences
      };
      
      const success = fitnessDataManager.updateUser(nestedUserData);
      if (success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setPreviewImage(null);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Unable to load profile data</p>
          <button 
            onClick={loadProfile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information and fitness preferences</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckIcon className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.name ? profile.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <button
                  onClick={triggerImageUpload}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div className="text-center mt-4 w-full">
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-center text-xl font-semibold text-gray-900 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-transparent"
                    placeholder="Your name"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                )}
                <p className="text-gray-600 mt-1">{profile.email}</p>
                <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Member since {new Date(profile.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Health Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ScaleIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Current Weight</p>
                      <p className="text-xs text-gray-600">Tracking progress</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{profile.weight} kg</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <TrophyIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Weight Goal</p>
                      <p className="text-xs text-gray-600">Target weight</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{profile.targetWeight} kg</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <FireIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Activity Level</p>
                      <p className="text-xs text-gray-600 capitalize">{profile.activityLevel?.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <ChartBarIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Active Goals</p>
                      <p className="text-xs text-gray-600">Fitness objectives</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{profile.fitnessGoals.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="25"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.age} years</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                {isEditing ? (
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{profile.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="175"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.height} cm</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={profile.weight}
                    onChange={(e) => setProfile(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="70.5"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.weight} kg</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (kg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={profile.targetWeight}
                    onChange={(e) => setProfile(prev => ({ ...prev, targetWeight: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="68.0"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.targetWeight} kg</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                {isEditing ? (
                  <select
                    value={profile.activityLevel}
                    onChange={(e) => setProfile(prev => ({ ...prev, activityLevel: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (Office job)</option>
                    <option value="lightly_active">Lightly Active (Light exercise)</option>
                    <option value="moderately_active">Moderately Active (Moderate exercise)</option>
                    <option value="very_active">Very Active (Heavy exercise)</option>
                    <option value="extremely_active">Extremely Active (Very heavy exercise)</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">Moderately Active (Moderate exercise)</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell us about yourself and your fitness journey..."
                />
              ) : (
                <p className="text-gray-900 py-2">{profile.bio}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Fitness Goals</h3>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Weight Loss
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Muscle Gain
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Build Endurance
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Unit System</label>
                  <p className="text-xs text-gray-500">Choose your preferred measurement units</p>
                </div>
                <span className="text-gray-900 capitalize">{profile.preferences.units}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                  <p className="text-xs text-gray-500">Receive updates about your progress</p>
                </div>
                <span className="text-gray-900">
                  {profile.preferences.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Workout Reminders</label>
                  <p className="text-xs text-gray-500">Get notified about scheduled workouts</p>
                </div>
                <span className="text-gray-900">
                  {profile.preferences.workoutReminders ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Weekly Reports</label>
                  <p className="text-xs text-gray-500">Receive weekly progress summaries</p>
                </div>
                <span className="text-gray-900">
                  {profile.preferences.weeklyReports ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
