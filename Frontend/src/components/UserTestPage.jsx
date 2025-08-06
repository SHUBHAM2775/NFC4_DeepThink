import React, { useState } from 'react';
import PastVoiceLogs from './PastVoiceLogs';

const UserTestPage = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showPastLogs, setShowPastLogs] = useState(false);

  const testUsers = [
    {
      id: '6892683647b1656bc9d5f7ea',
      name: 'Demo User 1 (Original)',
      description: '4 logs - Mixed health conditions'
    },
    {
      id: '6892da82cb134e02d1e8536c',
      name: 'Demo User 2 (New Test)',
      description: '2 logs - Back pain and good days'
    }
  ];

  const handleViewLogs = (userId) => {
    setSelectedUserId(userId);
    setShowPastLogs(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Voice Logs Testing</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Test Different User Voice Logs
          </h2>
          <p className="text-gray-600 mb-6">
            Click on any user below to view their specific voice logs. This demonstrates how the system 
            fetches logs based on the actual logged-in user ID instead of hardcoded data.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testUsers.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {user.description}
                </p>
                <p className="text-xs text-gray-500 mb-4 font-mono">
                  User ID: {user.id}
                </p>
                <button
                  onClick={() => handleViewLogs(user.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Past Logs
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How This Fixes the Issue
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>• <strong>Before:</strong> Patient Dashboard used hardcoded user ID "6892683647b1656bc9d5f7ea"</li>
            <li>• <strong>After:</strong> Patient Dashboard now gets user ID from the logged-in user object</li>
            <li>• <strong>Result:</strong> Each user sees only their own voice logs</li>
            <li>• <strong>API Enhancement:</strong> Backend now handles both string and ObjectId formats</li>
          </ul>
        </div>
      </div>

      {/* Past Voice Logs Modal */}
      {showPastLogs && selectedUserId && (
        <PastVoiceLogs 
          userId={selectedUserId} 
          onClose={() => {
            setShowPastLogs(false);
            setSelectedUserId('');
          }} 
        />
      )}
    </div>
  );
};

export default UserTestPage;
