import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugAuth = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const clearAllData = () => {
    localStorage.clear();
    logout();
    window.location.reload();
  };

  const checkAuthStatus = () => {
    console.log('🔍 Current Auth Status:', {
      isAuthenticated,
      user,
      token: localStorage.getItem('token'),
      storedUser: localStorage.getItem('user')
    });
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '2px solid red', 
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <h4>🐛 Debug Auth</h4>
      <p>Auth: {isAuthenticated ? '✅ YES' : '❌ NO'}</p>
      <p>User: {user?.name || 'None'}</p>
      <button 
        onClick={clearAllData}
        style={{ 
          background: 'red', 
          color: 'white', 
          border: 'none', 
          padding: '5px 10px',
          margin: '2px',
          cursor: 'pointer'
        }}
      >
        Clear All Data
      </button>
      <button 
        onClick={checkAuthStatus}
        style={{ 
          background: 'blue', 
          color: 'white', 
          border: 'none', 
          padding: '5px 10px',
          margin: '2px',
          cursor: 'pointer'
        }}
      >
        Check Status
      </button>
    </div>
  );
};

export default DebugAuth;