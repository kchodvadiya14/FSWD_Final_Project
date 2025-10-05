import React, { useState, useEffect } from 'react';
import { 
  ScaleIcon, 
  HeartIcon, 
  FireIcon, 
  MoonIcon,
  PlusIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState({
    weight: [],
    waterIntake: [],
    sleep: [],
    heartRate: []
  });

  const [newEntry, setNewEntry] = useState({
    type: 'weight',
    value: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  // Sample data
  useEffect(() => {
    const sampleData = {
      weight: [
        { id: 1, value: 70, date: '2024-01-01', notes: 'Starting weight' },
        { id: 2, value: 69.5, date: '2024-01-08', notes: 'Good progress' },
        { id: 3, value: 69, date: '2024-01-15', notes: 'Steady decline' }
      ],
      waterIntake: [
        { id: 1, value: 8, date: '2024-01-15', notes: 'Good hydration' },
        { id: 2, value: 6, date: '2024-01-14', notes: 'Need more water' }
      ],
      sleep: [
        { id: 1, value: 7.5, date: '2024-01-15', notes: 'Restful sleep' },
        { id: 2, value: 6, date: '2024-01-14', notes: 'Late night' }
      ],
      heartRate: [
        { id: 1, value: 65, date: '2024-01-15', notes: 'Resting HR' },
        { id: 2, value: 68, date: '2024-01-14', notes: 'After workout' }
      ]
    };
    setMetrics(sampleData);
  }, []);

  const handleAddEntry = (e) => {
    e.preventDefault();
    
    if (!newEntry.value) {
      toast.error('Please enter a value');
      return;
    }

    const entry = {
      id: Date.now(),
      value: parseFloat(newEntry.value),
      date: newEntry.date,
      notes: newEntry.notes
    };

    setMetrics(prev => ({
      ...prev,
      [newEntry.type]: [...prev[newEntry.type], entry]
    }));

    setNewEntry({
      type: 'weight',
      value: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });

    setShowAddForm(false);
    toast.success('Health metric added successfully!');
  };

  const getLatestValue = (type) => {
    const data = metrics[type];
    return data.length > 0 ? data[data.length - 1].value : 0;
  };

  const getTrend = (type) => {
    const data = metrics[type];
    if (data.length < 2) return 0;
    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    return latest - previous;
  };

  const metricCards = [
    {
      type: 'weight',
      title: 'Weight',
      value: getLatestValue('weight'),
      unit: 'kg',
      icon: ScaleIcon,
      color: 'blue',
      trend: getTrend('weight')
    },
    {
      type: 'waterIntake',
      title: 'Water Intake',
      value: getLatestValue('waterIntake'),
      unit: 'glasses',
      icon: HeartIcon,
      color: 'cyan',
      trend: getTrend('waterIntake')
    },
    {
      type: 'sleep',
      title: 'Sleep',
      value: getLatestValue('sleep'),
      unit: 'hours',
      icon: MoonIcon,
      color: 'purple',
      trend: getTrend('sleep')
    },
    {
      type: 'heartRate',
      title: 'Heart Rate',
      value: getLatestValue('heartRate'),
      unit: 'bpm',
      icon: HeartIcon,
      color: 'red',
      trend: getTrend('heartRate')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Metrics</h1>
          <p className="text-gray-600">Track your health data and monitor progress</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric) => (
          <div key={metric.type} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${metric.color}-100 rounded-xl flex items-center justify-center`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
              <div className="text-right">
                {metric.trend !== 0 && (
                  <span className={`text-sm ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">
                {metric.value} <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(metrics).map(([type, data]) => (
          <div key={type} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
              Recent {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </h3>
            <div className="space-y-3">
              {data.slice(-3).reverse().map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{entry.value}</p>
                    <p className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-gray-500 max-w-xs truncate">{entry.notes}</p>
                  )}
                </div>
              ))}
              {data.length === 0 && (
                <p className="text-gray-500 text-center py-4">No entries yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Entry Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Health Metric</h3>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metric Type</label>
                <select
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weight">Weight (kg)</option>
                  <option value="waterIntake">Water Intake (glasses)</option>
                  <option value="sleep">Sleep (hours)</option>
                  <option value="heartRate">Heart Rate (bpm)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={newEntry.value}
                  onChange={(e) => setNewEntry({...newEntry, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter value"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthMetrics;