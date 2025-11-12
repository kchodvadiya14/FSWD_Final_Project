import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UserIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  CameraIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    currentWeight: '',
    fitnessGoal: '',
    activityLevel: '',
    bio: ''
  });

  // Update formData when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        dateOfBirth: user?.dateOfBirth || user?.profile?.dateOfBirth || '',
        gender: user?.profile?.gender || '',
        height: user?.profile?.height?.value || '',
        currentWeight: user?.profile?.currentWeight?.value || '',
        fitnessGoal: user?.profile?.fitnessGoal || '',
        activityLevel: user?.profile?.activityLevel || '',
        bio: user?.profile?.bio || ''
      });
    }
  }, [user]);

  const fitnessGoals = [
    { value: 'lose_weight', label: 'Lose Weight' },
    { value: 'gain_weight', label: 'Gain Weight' },
    { value: 'maintain_weight', label: 'Maintain Weight' },
    { value: 'build_muscle', label: 'Build Muscle' },
    { value: 'improve_endurance', label: 'Improve Endurance' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'lightly_active', label: 'Lightly Active (light exercise 1-3 days/week)' },
    { value: 'moderately_active', label: 'Moderately Active (moderate exercise 3-5 days/week)' },
    { value: 'very_active', label: 'Very Active (hard exercise 6-7 days/week)' },
    { value: 'super_active', label: 'Super Active (very hard exercise, physical job)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        profile: {
          ...user.profile,
          dateOfBirth: formData.dateOfBirth,
          age: calculateAge(formData.dateOfBirth),
          gender: formData.gender,
          height: formData.height ? { value: parseFloat(formData.height), unit: 'cm' } : null,
          currentWeight: formData.currentWeight ? { value: parseFloat(formData.currentWeight), unit: 'kg' } : null,
          fitnessGoal: formData.fitnessGoal,
          activityLevel: formData.activityLevel,
          bio: formData.bio
        }
      };

      await updateUser(updatedData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      dateOfBirth: user?.dateOfBirth || user?.profile?.dateOfBirth || '',
      gender: user?.profile?.gender || '',
      height: user?.profile?.height?.value || '',
      currentWeight: user?.profile?.currentWeight?.value || '',
      fitnessGoal: user?.profile?.fitnessGoal || '',
      activityLevel: user?.profile?.activityLevel || '',
      bio: user?.profile?.bio || ''
    });
    setIsEditing(false);
  };

  const currentBMI = calculateBMI(formData.currentWeight, formData.height);
  const bmiInfo = getBMICategory(currentBMI);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information and fitness preferences</p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <CheckIcon className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <CameraIcon className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            
            {formData.dateOfBirth && (
              <p className="text-sm text-gray-500 mt-2">
                {calculateAge(formData.dateOfBirth)} years old
              </p>
            )}

            {/* Quick Stats */}
            <div className="mt-6 space-y-3">
              {currentBMI > 0 && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">BMI</p>
                  <p className="font-semibold text-gray-900">
                    {currentBMI} <span className={`text-sm ${bmiInfo.color}`}>({bmiInfo.category})</span>
                  </p>
                </div>
              )}
              
              {formData.fitnessGoal && (
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600">Fitness Goal</p>
                  <p className="font-medium text-blue-900 capitalize">
                    {formData.fitnessGoal.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl">{formData.name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl">{formData.email || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl">
                    {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl capitalize">{formData.gender || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter height in cm"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl">
                    {formData.height ? `${formData.height} cm` : 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    name="currentWeight"
                    value={formData.currentWeight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter weight in kg"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl">
                    {formData.currentWeight ? `${formData.currentWeight} kg` : 'Not provided'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
                {isEditing ? (
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your fitness goal</option>
                    {fitnessGoals.map(goal => (
                      <option key={goal.value} value={goal.value}>{goal.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl">
                    {fitnessGoals.find(goal => goal.value === formData.fitnessGoal)?.label || 'Not selected'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                {isEditing ? (
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {activityLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl">
                    {activityLevels.find(level => level.value === formData.activityLevel)?.label || 'Not selected'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl min-h-[80px]">
                    {formData.bio || 'No bio provided'}
                  </p>
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