import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  BellIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'workout',
    frequency: 'daily',
    time: '',
    days: [],
    isActive: true
  });

  const reminderTypes = [
    { value: 'workout', label: 'Workout', icon: '💪' },
    { value: 'meal', label: 'Meal', icon: '🍎' },
    { value: 'water', label: 'Water', icon: '💧' },
    { value: 'medication', label: 'Medication', icon: '💊' },
    { value: 'sleep', label: 'Sleep', icon: '😴' },
    { value: 'custom', label: 'Custom', icon: '⏰' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'custom', label: 'Custom Days' }
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  useEffect(() => {
    fetchReminders();
    // Request notification permission
    requestNotificationPermission();
    // Set up reminder checks
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Please enable notifications for reminders to work');
      }
    }
  };

  const fetchReminders = async () => {
    try {
      // For now, use localStorage. In production, fetch from API
      const savedReminders = localStorage.getItem('fitness_reminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to fetch reminders');
    } finally {
      setLoading(false);
    }
  };

  const saveReminders = (newReminders) => {
    try {
      localStorage.setItem('fitness_reminders', JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
      toast.error('Failed to save reminders');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newReminder = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    const updatedReminders = [...reminders, newReminder];
    saveReminders(updatedReminders);
    
    toast.success('Reminder created successfully');
    resetForm();
  };

  const handleDelete = (reminderId) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    
    const updatedReminders = reminders.filter(reminder => reminder.id !== reminderId);
    saveReminders(updatedReminders);
    toast.success('Reminder deleted');
  };

  const toggleReminder = (reminderId) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    );
    saveReminders(updatedReminders);
    toast.success('Reminder updated');
  };

  const checkReminders = () => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });

    reminders.forEach(reminder => {
      if (!reminder.isActive) return;

      const shouldRemind = shouldTriggerReminder(reminder, currentDay, currentTime);
      
      if (shouldRemind) {
        showNotification(reminder);
      }
    });
  };

  const shouldTriggerReminder = (reminder, currentDay, currentTime) => {
    if (reminder.time !== currentTime) return false;

    switch (reminder.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        return currentDay === 'sunday'; // Adjust as needed
      case 'weekdays':
        return !['saturday', 'sunday'].includes(currentDay);
      case 'weekends':
        return ['saturday', 'sunday'].includes(currentDay);
      case 'custom':
        return reminder.days.includes(currentDay);
      default:
        return false;
    }
  };

  const showNotification = (reminder) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(reminder.title, {
        body: reminder.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: reminder.id
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }

    // Also show in-app toast
    toast.success(`Reminder: ${reminder.title}`, {
      duration: 6000,
      icon: reminderTypes.find(type => type.value === reminder.type)?.icon
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'workout',
      frequency: 'daily',
      time: '',
      days: [],
      isActive: true
    });
    setShowModal(false);
  };

  const handleDayToggle = (day) => {
    const updatedDays = formData.days.includes(day)
      ? formData.days.filter(d => d !== day)
      : [...formData.days, day];
    
    setFormData({ ...formData, days: updatedDays });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-2">Stay on track with personalized notifications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Reminder
        </button>
      </div>

      {/* Notification Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <BellIcon className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            {Notification?.permission === 'granted' ? 'Notifications enabled' : 'Notifications disabled'}
          </span>
        </div>
        {Notification?.permission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
          >
            Enable notifications
          </button>
        )}
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((reminder) => {
          const typeInfo = reminderTypes.find(type => type.value === reminder.type);
          
          return (
            <div key={reminder.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{typeInfo?.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                    {reminder.message && (
                      <p className="text-gray-600 text-sm mt-1">{reminder.message}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {reminder.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDaysIcon className="h-4 w-4" />
                        {frequencies.find(f => f.value === reminder.frequency)?.label}
                      </div>
                      {reminder.frequency === 'custom' && reminder.days.length > 0 && (
                        <div className="text-xs">
                          {reminder.days.map(day => 
                            daysOfWeek.find(d => d.value === day)?.label
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`p-2 rounded-md transition-colors ${
                      reminder.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={reminder.isActive ? 'Active' : 'Inactive'}
                  >
                    {reminder.isActive ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reminders.length === 0 && (
        <div className="text-center py-12">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reminders set</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create reminders to stay consistent with your fitness routine.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              Add First Reminder
            </button>
          </div>
        </div>
      )}

      {/* Reminder Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Reminder</h2>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Morning Workout"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="2"
                    placeholder="Time for your workout!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {reminderTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={`p-3 border rounded-md text-center transition-colors ${
                          formData.type === type.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-xl">{type.icon}</div>
                        <div className="text-xs mt-1">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value, days: [] })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {frequencies.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.frequency === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDayToggle(day.value)}
                          className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                            formData.days.includes(day.value)
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;