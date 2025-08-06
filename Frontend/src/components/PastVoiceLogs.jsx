import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PastVoiceLogs = ({ userId, onClose }) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('week'); // 'week', 'month'

  useEffect(() => {
    if (userId) {
      loadPastLogs();
    }
  }, [userId, filter]);

  const loadPastLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range based on filter
      const endDate = new Date();
      const startDate = new Date();
      
      if (filter === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (filter === 'month') {
        startDate.setDate(endDate.getDate() - 30);
      }

      const response = await fetch(
        `http://localhost:5000/api/voice/logs/user/${userId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      
      const data = await response.json();

      if (response.ok) {
        setLogs(data.logs || []);
      } else {
        throw new Error(data.msg || 'Failed to load past logs');
      }
    } catch (err) {
      console.error('Error loading past logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHealthStatus = (log) => {
    const symptoms = log.parsedData?.extractedInfo?.symptoms || log.parsedData?.symptoms || [];
    const mood = log.parsedData?.extractedInfo?.mood || log.parsedData?.mood || 'normal';
    
    if (symptoms.length > 2) return { status: 'concerning', color: 'text-red-600 bg-red-50' };
    if (symptoms.length > 0) return { status: 'moderate', color: 'text-yellow-600 bg-yellow-50' };
    if (mood === 'good' || mood === 'happy') return { status: 'good', color: 'text-green-600 bg-green-50' };
    return { status: 'normal', color: 'text-gray-600 bg-gray-50' };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('pastVoiceLogs', 'Past Voice Logs')}
            </h2>
            <p className="text-gray-600 mt-1">
              {t('pastLogsDesc', 'Review your recent health updates and AI guidance')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('week')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('pastWeek', 'Past Week')}
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('pastMonth', 'Past Month')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {logs.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('noLogsFound', 'No Voice Logs Found')}
              </h3>
              <p className="text-gray-600">
                {t('noLogsDesc', `No voice logs found for the selected ${filter} period.`)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => {
                const healthStatus = getHealthStatus(log);
                const symptoms = log.parsedData?.extractedInfo?.symptoms || log.parsedData?.symptoms || [];
                const mood = log.parsedData?.extractedInfo?.mood || log.parsedData?.mood;
                const concerns = log.parsedData?.extractedInfo?.concerns || [];
                const guidance = log.parsedData?.aiGuidance;

                return (
                  <div key={log._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Log Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(log.createdAt)}
                        </span>
                        {log.week && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Week {log.week}
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${healthStatus.color}`}>
                          {healthStatus.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.language && `Language: ${log.language}`}
                      </div>
                    </div>

                    {/* Original Transcript */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {t('originalMessage', 'Original Message')}
                      </h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {log.transcript}
                      </p>
                    </div>

                    {/* Extracted Information */}
                    {(symptoms.length > 0 || mood || concerns.length > 0) && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          {t('healthInfo', 'Health Information')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {mood && (
                            <div className="bg-blue-50 p-2 rounded">
                              <span className="text-xs font-medium text-blue-900">Mood:</span>
                              <span className="text-xs text-blue-800 ml-1">{mood}</span>
                            </div>
                          )}
                          {symptoms.length > 0 && (
                            <div className="bg-yellow-50 p-2 rounded">
                              <span className="text-xs font-medium text-yellow-900">Symptoms:</span>
                              <span className="text-xs text-yellow-800 ml-1">
                                {symptoms.join(', ')}
                              </span>
                            </div>
                          )}
                          {concerns.length > 0 && (
                            <div className="bg-red-50 p-2 rounded">
                              <span className="text-xs font-medium text-red-900">Concerns:</span>
                              <span className="text-xs text-red-800 ml-1">
                                {concerns.length} noted
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI Guidance */}
                    {guidance && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {t('aiGuidance', 'AI Guidance Provided')}
                        </h4>
                        <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                          {guidance}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {t('totalLogs', `Total logs: ${logs.length}`)}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {t('close', 'Close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastVoiceLogs;
