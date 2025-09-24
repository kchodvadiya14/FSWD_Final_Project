import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  ScaleIcon,
  HeartIcon,
  ActivityIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  
  const [newEntry, setNewEntry] = useState({
    type: 'weight',
    value: '',
    unit: 'kg',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Mock data for demonstration
  const mockMetrics = {
    weight: [
      { date: '2024-01-01', value: 75, unit: 'kg' },
      { date: '2024-01-08', value: 74.5, unit: 'kg' },
      { date: '2024-01-15', value: 74.2, unit: 'kg' },
      { date: '2024-01-22', value: 73.8, unit: 'kg' },
      { date: '2024-01-29', value: 73.5, unit: 'kg' }
    ],
    heart_rate: [
      { date: '2024-01-01', value: 72, unit: 'bpm' },
      { date: '2024-01-08', value: 70, unit: 'bpm' },
      { date: '2024-01-15', value: 68, unit: 'bpm' },
      { date: '2024-01-22', value: 69, unit: 'bpm' },
      { date: '2024-01-29', value: 67, unit: 'bpm' }
    ],
    blood_pressure: [
      { date: '2024-01-01', value: 120, systolic: 120, diastolic: 80, unit: 'mmHg' },
      { date: '2024-01-08', value: 118, systolic: 118, diastolic: 78, unit: 'mmHg' },
      { date: '2024-01-15', value: 115, systolic: 115, diastolic: 75, unit: 'mmHg' },
      { date: '2024-01-22', value: 117, systolic: 117, diastolic: 77, unit: 'mmHg' },
      { date: '2024-01-29', value: 114, systolic: 114, diastolic: 74, unit: 'mmHg' }
    ]
  };

  useEffect(() => {
    // In a real app, fetch from API
    setMetrics(mockMetrics[selectedMetric] || []);
  }, [selectedMetric]);

  const metricTypes = {
    weight: { label: 'Weight', icon: ScaleIcon, unit: 'kg', color: 'blue' },
    heart_rate: { label: 'Heart Rate', icon: HeartIcon, unit: 'bpm', color: 'red' },
    blood_pressure: { label: 'Blood Pressure', icon: ActivityIcon, unit: 'mmHg', color: 'green' },
    body_fat: { label: 'Body Fat %', icon: TrendingDownIcon, unit: '%', color: 'yellow' },
    muscle_mass: { label: 'Muscle Mass', icon: TrendingUpIcon, unit: 'kg', color: 'purple' }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    
    if (!newEntry.value) {
      toast.error('Please enter a value');
      return;
    }

    try {
      // In a real app, call API to save the entry
      const newMetricEntry = {
        date: newEntry.date,
        value: parseFloat(newEntry.value),
        unit: newEntry.unit,
        notes: newEntry.notes
      };

      // Add to mock data
      const updatedMetrics = [...metrics, newMetricEntry].sort((a, b) => new Date(a.date) - new Date(b.date));
      setMetrics(updatedMetrics);
      
      toast.success('Health metric added successfully!');
      setShowAddModal(false);
      setNewEntry({
        type: selectedMetric,
        value: '',
        unit: metricTypes[selectedMetric].unit,
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      console.error('Failed to add metric:', error);
      toast.error('Failed to add health metric');
    }
  };

  const getChartData = () => {
    return {
      labels: metrics.map(m => new Date(m.date).toLocaleDateString()),
      datasets: [
        {
          label: metricTypes[selectedMetric].label,
          data: metrics.map(m => m.value),
          borderColor: `rgb(${getColorRGB(metricTypes[selectedMetric].color)})`,
          backgroundColor: `rgba(${getColorRGB(metricTypes[selectedMetric].color)}, 0.1)`,
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }
      ]
    };
  };

  const getColorRGB = (color) => {
    const colors = {
      blue: '59, 130, 246',
      red: '239, 68, 68',
      green: '34, 197, 94',
      yellow: '251, 191, 36',
      purple: '147, 51, 234'
    };
    return colors[color] || '107, 114, 128';
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  const getLatestValue = () => {
    if (metrics.length === 0) return null;
    return metrics[metrics.length - 1];
  };

  const getTrend = () => {
    if (metrics.length < 2) return null;
    const latest = metrics[metrics.length - 1];
    const previous = metrics[metrics.length - 2];
    const change = latest.value - previous.value;
    return {
      change: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
    };
  };

  const latest = getLatestValue();
  const trend = getTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
          <p className="text-gray-600">Track your vital health measurements</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Entry
        </button>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(metricTypes).map(([key, type]) => {
          const Icon = type.icon;
          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedMetric === key
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Icon className={`h-6 w-6 mx-auto mb-2 ${
                selectedMetric === key ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <div className={`text-sm font-medium ${
                selectedMetric === key ? 'text-indigo-900' : 'text-gray-600'
              }`}>
                {type.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Value & Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Current {metricTypes[selectedMetric].label}
            </h3>
            {latest ? (
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  {latest.value} {latest.unit}
                </span>
                {trend && trend.direction !== 'same' && (
                  <div className={`flex items-center gap-1 ${
                    trend.direction === 'up' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {trend.direction === 'up' ? (
                      <TrendingUpIcon className="h-4 w-4" />
                    ) : (
                      <TrendingDownIcon className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {trend.change.toFixed(1)} {latest.unit}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">
              {latest ? new Date(latest.date).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {metricTypes[selectedMetric].label} Trend
        </h3>
        {metrics.length > 0 ? (
          <div className="h-64">
            <Line data={getChartData()} options={chartOptions} />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p>No data to display</p>
              <p className="text-sm mt-1">Add your first entry to see the trend</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Entries</h3>
        </div>
        {metrics.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No entries yet for {metricTypes[selectedMetric].label}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Add your first entry
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {metrics.slice().reverse().slice(0, 10).map((entry, index) => (
              <div key={index} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {entry.value} {entry.unit}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                    )}
                  </div>
                  {selectedMetric === 'blood_pressure' && entry.systolic && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {entry.systolic}/{entry.diastolic} mmHg
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add {metricTypes[selectedMetric].label} Entry
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value ({metricTypes[selectedMetric].unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newEntry.value}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, value: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add any notes..."
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add Entry
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

export default HealthMetrics;