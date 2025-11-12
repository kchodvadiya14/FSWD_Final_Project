import React, { useState, useEffect } from 'react';
import { goalService } from '../services/fitnessService';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  FlagIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [filter, setFilter] = useState('all');

  const [newGoal, setNewGoal] = useState({
    type: 'weight_loss',
    title: '',
    description: '',
    targetValue: '',
    unit: 'kg',
    targetDate: '',
    priority: 'medium'
  });

  const [progressUpdate, setProgressUpdate] = useState({
    value: '',
    note: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await goalService.getGoals();
      setGoals(data.data || []);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    
    if (!newGoal.title.trim() || !newGoal.targetValue || !newGoal.targetDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await goalService.createGoal({
        ...newGoal,
        targetValue: parseFloat(newGoal.targetValue)
      });
      toast.success('Goal created successfully!');
      setShowNewGoalModal(false);
      setNewGoal({
        type: 'weight_loss',
        title: '',
        description: '',
        targetValue: '',
        unit: 'kg',
        targetDate: '',
        priority: 'medium'
      });
      fetchGoals();
    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error(error.message || 'Failed to create goal');
    }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    
    if (!progressUpdate.value) {
      toast.error('Please enter a progress value');
      return;
    }

    try {
      await goalService.updateGoalProgress(selectedGoal._id, progressUpdate);
      toast.success('Progress updated successfully!');
      setShowProgressModal(false);
      setProgressUpdate({ value: '', note: '' });
      setSelectedGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Failed to update progress:', error);
      toast.error(error.message || 'Failed to update progress');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await goalService.deleteGoal(goalId);
      toast.success('Goal deleted successfully');
      fetchGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleStatusChange = async (goalId, newStatus) => {
    try {
      await goalService.updateGoal(goalId, { status: newStatus });
      toast.success('Goal status updated');
      fetchGoals();
    } catch (error) {
      console.error('Failed to update goal status:', error);
      toast.error('Failed to update goal status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: FlagIcon,
      completed: CheckCircleIcon,
      paused: PauseCircleIcon,
      cancelled: XCircleIcon
    };
    const Icon = icons[status] || FlagIcon;
    return <Icon className="h-4 w-4" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-yellow-500',
      high: 'text-red-500'
    };
    return colors[priority] || 'text-gray-500';
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const goalTypes = {
    weight_loss: 'Weight Loss',
    weight_gain: 'Weight Gain',
    muscle_gain: 'Muscle Gain',
    endurance: 'Endurance',
    strength: 'Strength',
    custom: 'Custom'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fitness Goals</h1>
          <p className="text-gray-600">Set and track your fitness objectives</p>
        </div>
        <button
          onClick={() => setShowNewGoalModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Goal
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Goals' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' },
            { key: 'paused', label: 'Paused' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FlagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No goals found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Get started by creating your first fitness goal.' 
                : `No ${filter} goals found.`}
            </p>
            {filter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => setShowNewGoalModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Goal
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div key={goal._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)} flex items-center gap-1`}>
                      {getStatusIcon(goal.status)}
                      {goal.status}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {goal.priority} priority
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Type:</span>
                      <p className="text-sm text-gray-900">{goalTypes[goal.type]}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Progress:</span>
                      <p className="text-sm text-gray-900">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Target Date:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(goal.targetDate).toLocaleDateString()}
                        {goal.status === 'active' && (
                          <span className={`ml-2 text-xs ${getDaysRemaining(goal.targetDate) < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            ({getDaysRemaining(goal.targetDate)} days {getDaysRemaining(goal.targetDate) < 0 ? 'overdue' : 'remaining'})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500">Progress</span>
                      <span className="text-xs text-gray-500">
                        {Math.round(goal.progressPercentage || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          goal.status === 'completed' ? 'bg-green-600' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(goal.progressPercentage || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Milestones */}
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs font-medium text-gray-500 mb-2 block">Milestones:</span>
                      <div className="flex flex-wrap gap-2">
                        {goal.milestones.map((milestone, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 text-xs rounded ${
                              milestone.achieved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {milestone.value} {goal.unit} - {milestone.description}
                            {milestone.achieved && ' ✓'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {goal.status === 'active' && (
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setProgressUpdate({ value: goal.currentValue.toString(), note: '' });
                        setShowProgressModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Update Progress
                    </button>
                  )}
                  
                  {goal.status === 'active' && (
                    <button
                      onClick={() => handleStatusChange(goal._id, 'paused')}
                      className="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                    >
                      Pause
                    </button>
                  )}
                  
                  {goal.status === 'paused' && (
                    <button
                      onClick={() => handleStatusChange(goal._id, 'active')}
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Resume
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteGoal(goal._id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Goal</h3>
                <button
                  onClick={() => setShowNewGoalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Type
                  </label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Object.entries(goalTypes).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Lose 10kg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your goal..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Value *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newGoal.targetValue}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="kg, lbs, km, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewGoalModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {showProgressModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Update Progress</h3>
                <button
                  onClick={() => {
                    setShowProgressModal(false);
                    setSelectedGoal(null);
                    setProgressUpdate({ value: '', note: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900">{selectedGoal.title}</h4>
                <p className="text-sm text-gray-600">
                  Current: {selectedGoal.currentValue} {selectedGoal.unit} / Target: {selectedGoal.targetValue} {selectedGoal.unit}
                </p>
              </div>

              <form onSubmit={handleUpdateProgress} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Value ({selectedGoal.unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={progressUpdate.value}
                    onChange={(e) => setProgressUpdate(prev => ({ ...prev, value: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optional)
                  </label>
                  <textarea
                    value={progressUpdate.note}
                    onChange={(e) => setProgressUpdate(prev => ({ ...prev, note: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add a note about this progress update..."
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProgressModal(false);
                      setSelectedGoal(null);
                      setProgressUpdate({ value: '', note: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Update Progress
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;