import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ASHAPastVoiceLogs = ({ patientId, patientName, onClose }) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('week'); // 'week', 'month'

  useEffect(() => {
    if (patientId) {
      loadPastLogs();
    }
  }, [patientId, filter]);

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
        `http://localhost:5000/api/voice/logs/user/${patientId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
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
    const escalation = log.parsedData?.escalation;
    
    if (escalation?.urgent) return { status: 'urgent', color: 'text-red-600 bg-red-50 border-red-200' };
    if (symptoms.length > 2) return { status: 'concerning', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    if (symptoms.length > 0) return { status: 'monitoring', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    if (mood === 'good' || mood === 'happy') return { status: 'good', color: 'text-green-600 bg-green-50 border-green-200' };
    return { status: 'normal', color: 'text-gray-600 bg-gray-50 border-gray-200' };
  };

  const getPriorityScore = (log) => {
    const escalation = log.parsedData?.escalation;
    const symptoms = log.parsedData?.extractedInfo?.symptoms || log.parsedData?.symptoms || [];
    const concerns = log.parsedData?.extractedInfo?.concerns || [];
    
    if (escalation?.urgent) return 5;
    if (symptoms.length > 3 || concerns.length > 2) return 4;
    if (symptoms.length > 1 || concerns.length > 0) return 3;
    if (symptoms.length > 0) return 2;
    return 1;
  };

  // Sort logs by priority (urgent first) and then by date
  const sortedLogs = [...logs].sort((a, b) => {
    const priorityA = getPriorityScore(a);
    const priorityB = getPriorityScore(b);
    
    if (priorityA !== priorityB) {
      return priorityB - priorityA; // Higher priority first
    }
    
    return new Date(b.createdAt) - new Date(a.createdAt); // More recent first
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-hidden">
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
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('ashaPastLogs.title', 'Patient Voice Logs')}
            </h2>
            <p className="text-gray-600 mt-1">
              {t('ashaPastLogs.subtitle', `Monitoring ${patientName || 'Patient'}'s health updates`)}
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
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('week')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'week'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {t('ashaPastLogs.thisWeek', 'This Week')}
              </button>
              <button
                onClick={() => setFilter('month')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'month'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {t('ashaPastLogs.thisMonth', 'This Month')}
              </button>
            </div>
            
            {logs.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{logs.length}</span> {t('ashaPastLogs.logsFound', 'logs found')}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {sortedLogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-purple-300"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('ashaPastLogs.noLogs', 'No Voice Logs Found')}
              </h3>
              <p className="text-gray-600">
                {t('ashaPastLogs.noLogsDesc', `No voice logs found for ${patientName || 'this patient'} in the selected ${filter} period.`)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedLogs.map((log, index) => {
                const healthStatus = getHealthStatus(log);
                const symptoms = log.parsedData?.extractedInfo?.symptoms || log.parsedData?.symptoms || [];
                const mood = log.parsedData?.extractedInfo?.mood || log.parsedData?.mood;
                const concerns = log.parsedData?.extractedInfo?.concerns || [];
                const guidance = log.parsedData?.aiGuidance;
                const escalation = log.parsedData?.escalation;
                const energyLevel = log.parsedData?.extractedInfo?.energy_level;
                const sleepHours = log.parsedData?.extractedInfo?.sleep_hours;
                const waterIntake = log.parsedData?.extractedInfo?.water_intake;
                const exercise = log.parsedData?.extractedInfo?.exercise;

                return (
                  <div 
                    key={log._id || index} 
                    className={`border-2 rounded-lg p-5 hover:shadow-lg transition-all ${healthStatus.color}`}
                  >
                    {/* Log Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-gray-900">
                          {formatDate(log.createdAt)}
                        </span>
                        {log.week && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Pregnancy Week {log.week}
                          </span>
                        )}
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${healthStatus.color}`}>
                          {healthStatus.status.toUpperCase()}
                        </span>
                        {escalation?.urgent && (
                          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                            URGENT ATTENTION
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.language && `Language: ${log.language}`}
                      </div>
                    </div>

                    {/* Original Transcript */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {t('ashaPastLogs.patientMessage', 'Patient\'s Original Message')}
                      </h4>
                      <p className="text-sm text-gray-800 bg-white p-3 rounded-lg border-l-4 border-blue-500">
                        {log.transcript}
                      </p>
                    </div>

                    {/* Health Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      {mood && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <span className="text-xs font-bold text-blue-900 block">MOOD</span>
                          <span className="text-sm font-medium text-blue-800">{mood}</span>
                        </div>
                      )}
                      {energyLevel && (
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <span className="text-xs font-bold text-green-900 block">ENERGY</span>
                          <span className="text-sm font-medium text-green-800">{energyLevel}</span>
                        </div>
                      )}
                      {sleepHours && (
                        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg">
                          <span className="text-xs font-bold text-indigo-900 block">SLEEP</span>
                          <span className="text-sm font-medium text-indigo-800">{sleepHours} hours</span>
                        </div>
                      )}
                      {waterIntake && (
                        <div className="bg-cyan-50 border border-cyan-200 p-3 rounded-lg">
                          <span className="text-xs font-bold text-cyan-900 block">WATER</span>
                          <span className="text-sm font-medium text-cyan-800">{waterIntake}</span>
                        </div>
                      )}
                    </div>

                    {/* Symptoms and Concerns */}
                    {(symptoms.length > 0 || concerns.length > 0) && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          {t('ashaPastLogs.symptomsAndConcerns', 'Symptoms & Concerns')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {symptoms.map((symptom, idx) => (
                            <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-300">
                              {symptom}
                            </span>
                          ))}
                          {concerns.map((concern, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-300">
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Guidance */}
                    {guidance && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {t('ashaPastLogs.aiGuidance', 'AI Guidance Provided')}
                        </h4>
                        <p className="text-sm text-green-800 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                          {guidance}
                        </p>
                      </div>
                    )}

                    {/* Emergency Escalation */}
                    {escalation && escalation.urgent && (
                      <div className="border-2 border-red-500 bg-red-50 p-4 rounded-lg">
                        <h4 className="text-sm font-bold text-red-900 mb-2 flex items-center">
                          <span className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                          {t('ashaPastLogs.emergencyAlert', 'EMERGENCY ESCALATION TRIGGERED')}
                        </h4>
                        <p className="text-sm text-red-800 font-medium mb-2">{escalation.message}</p>
                        {escalation.contact_info && (
                          <p className="text-xs text-red-700">
                            <strong>Contact:</strong> {escalation.contact_info}
                          </p>
                        )}
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
              {sortedLogs.length > 0 && (
                <>
                  <span className="font-medium">{sortedLogs.filter(log => getPriorityScore(log) >= 4).length}</span> urgent/concerning logs • 
                  <span className="font-medium ml-1">{sortedLogs.filter(log => getPriorityScore(log) === 3).length}</span> monitoring required • 
                  <span className="font-medium ml-1">{sortedLogs.filter(log => getPriorityScore(log) <= 2).length}</span> normal
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              {t('ashaPastLogs.close', 'Close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASHAPastVoiceLogs;
