import React from 'react';

function App() {
  return (
    <div className="App">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🏋️‍♂️ NutriFit
            </h1>
            <p className="text-gray-600 mb-6">
              Fitness & Nutrition Tracker
            </p>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">✅ Frontend Connected</p>
                <p className="text-green-600 text-sm">React is working properly</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">🚀 Ready to Launch</p>
                <p className="text-blue-600 text-sm">All systems operational</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 font-medium">🌐 Server Info</p>
                <p className="text-gray-600 text-sm">Frontend: localhost:5174</p>
                <p className="text-gray-600 text-sm">Backend: localhost:5001</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;