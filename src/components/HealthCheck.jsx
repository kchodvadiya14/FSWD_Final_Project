import React, { useState, useEffect } from 'react';
import api from '../services/api';

const HealthCheck = () => {
  const [status, setStatus] = useState('checking');
  const [details, setDetails] = useState({});

  const checkBackendHealth = async () => {
    try {
      setStatus('checking');
      
      // Test basic connectivity
      const response = await api.get('/health');
      
      setStatus('connected');
      setDetails({
        message: 'Backend is running successfully!',
        data: response.data,
        timestamp: new Date().toLocaleTimeString()
      });
      
    } catch (error) {
      setStatus('error');
      setDetails({
        message: 'Cannot connect to backend',
        error: error.message,
        status: error.response?.status,
        timestamp: new Date().toLocaleTimeString(),
        baseURL: api.defaults.baseURL
      });
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="font-medium mb-2">Backend Connection Status</h3>
      
      <div className={`flex items-center gap-2 mb-2 ${getStatusColor()}`}>
        <span>{getStatusIcon()}</span>
        <span className="font-medium capitalize">{status}</span>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>API URL:</strong> {api.defaults.baseURL}</p>
        <p><strong>Last Check:</strong> {details.timestamp}</p>
        
        {status === 'connected' && (
          <div className="text-green-600">
            <p><strong>Status:</strong> {details.data?.message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-600">
            <p><strong>Error:</strong> {details.error}</p>
            {details.status && <p><strong>Status Code:</strong> {details.status}</p>}
          </div>
        )}
      </div>
      
      <button
        onClick={checkBackendHealth}
        className="mt-3 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Recheck Connection
      </button>
      
      {status === 'error' && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <p><strong>Troubleshooting:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Make sure backend server is running on port 5001</li>
            <li>Check if MongoDB is running</li>
            <li>Verify .env file configuration</li>
            <li>Check browser console for additional errors</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HealthCheck;