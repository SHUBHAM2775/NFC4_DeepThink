import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PersonalizedReminders = ({ userId }) => {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complianceData, setComplianceData] = useState({
    percentage: 0,
    todayCompleted: 0,
    totalToday: 5
  });
  const [weekStatus, setWeekStatus] = useState({ active: false });
  const [error, setError] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({});

  // Category colors (no icons for clean look)
  const categoryConfig = {
    medication: { color: 'bg-red-100 text-red-800 border-red-200' },
    nutrition: { color: 'bg-blue-100 text-blue-800 border-blue-200' },
    exercise: { color: 'bg-green-100 text-green-800 border-green-200' },
    monitoring: { color: 'bg-purple-100 text-purple-800 border-purple-200' },
    appointment: { color: 'bg-orange-100 text-orange-800 border-orange-200' },
    default: { color: 'bg-gray-100 text-gray-800 border-gray-200' }
  };

  // Auto-load reminders on component mount (triggers auto-generation if needed)
  useEffect(() => {
    if (userId) {
      loadCurrentReminders();
    }
  }, [userId]);

  const loadCurrentReminders = async () => {
    try {
      setLoading(true);
      setError(null);

      // This endpoint now auto-checks and generates reminders if needed
      const response = await fetch(`http://localhost:5000/api/reminders/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setReminders(data.data?.reminders || []);
        setComplianceData({
          percentage: data.compliance_percentage || 0,
          todayCompleted: data.today_completion || 0,
          totalToday: data.data?.reminders?.length || 5
        });
        setWeekStatus(data.week_status || { active: false });
        
        // Initialize completion status from backend data
        const completions = {};
        const today = new Date().toISOString().split('T')[0];
        
        if (data.data?.completionTracking) {
          data.data.completionTracking.forEach(track => {
            const trackDate = new Date(track.date).toISOString().split('T')[0];
            if (trackDate === today) {
              completions[track.reminderId] = track.completed;
            }
          });
        }
        
        setCompletionStatus(completions);
        
        // Show auto-generation message if it happened
        if (data.auto_generated_this_call) {
          console.log('✨ New reminders auto-generated based on your recent activity');
        }
        
      } else {
        throw new Error(data.msg || 'Failed to load reminders');
      }
    } catch (err) {
      console.error('Error loading reminders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleReminderComplete = async (reminderId, currentCompleted = false) => {
    try {
      const response = await fetch('http://localhost:5000/api/reminders/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          reminderId: reminderId,
          completed: !currentCompleted
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local completion status
        setCompletionStatus(prev => ({
          ...prev,
          [reminderId]: !currentCompleted
        }));
        
        // Update compliance data
        setComplianceData({
          percentage: data.compliance_percentage || 0,
          todayCompleted: data.today_completion || 0,
          totalToday: reminders.length
        });
        
      } else {
        throw new Error(data.msg || 'Failed to update reminder');
      }
    } catch (err) {
      console.error('Error updating reminder:', err);
      setError(err.message);
    }
  };

  const getReminderCompletionStatus = (reminderId) => {
    return completionStatus[reminderId] || false;
  };

  const getComplianceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            AI-Personalized Daily Reminders
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className={`font-medium ${getComplianceColor(complianceData.percentage)}`}>
              {complianceData.percentage}% {t('compliance', 'compliance this week')}
            </span>
            <span>
              {complianceData.todayCompleted}/{complianceData.totalToday} {t('completedToday', 'completed today')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {t('autoGenerated', 'Auto-Generated')}
          </span>
          {weekStatus.active && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {t('activeWeek', 'Active Week')}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Compliance Progress Bar */}
      {reminders.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t('weeklyProgress', 'Weekly Progress')}</span>
            <span>{complianceData.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                complianceData.percentage >= 80 ? 'bg-green-500' :
                complianceData.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${complianceData.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Reminders List */}
      {reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map((reminder, index) => {
            const config = categoryConfig[reminder.category] || categoryConfig.default;
            const isCompleted = getReminderCompletionStatus(reminder.id);
            
            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200 opacity-75' 
                    : `${config.color} hover:shadow-md`
                }`}
                onClick={() => toggleReminderComplete(reminder.id, isCompleted)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCompleted ? 'line-through text-gray-600' : 'text-gray-900'}`}>
                        {reminder.text}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          {t(reminder.category, reminder.category)}
                        </span>
                        {reminder.priority === 'high' && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {t('highPriority', 'High Priority')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleReminderComplete(reminder.id, isCompleted)}
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {t('autoGenerating', 'Auto-Generating Your Reminders...')}
          </h4>
          <p className="text-gray-600 mb-4">
            {t('autoGenerateDesc', 'Your personalized reminders are being generated automatically based on your recent voice logs and pregnancy stage.')}
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span>{t('processing', 'Processing your health data...')}</span>
          </div>
        </div>
      )}

      {/* Auto-Generation Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              {t('aiPowered', 'AI-Powered Personalization')}
            </h4>
            <p className="text-sm text-gray-600">
              {t('aiDescription', 'Your reminders are automatically generated weekly based on your voice logs, pregnancy stage, and health patterns. No manual action needed!')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedReminders;
