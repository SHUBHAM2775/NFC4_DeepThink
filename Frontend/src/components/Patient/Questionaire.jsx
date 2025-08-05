import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PatientQuestionnaireFlow from './Questionnaire/PatientQuestionnaireFlow';

// Wrapper component for usage example
function Questionaire({ onComplete, user, isLoading, error }) {
  const { t } = useTranslation();
  const [data, setData] = useState({});

  // Breadcrumb data
  const breadcrumbs = [
    { label: t("nav.home", "Home"), path: "/login" }
  ];

  const handleUpdate = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = () => {
    if (onComplete) {
      onComplete(data);
    } else {
      alert('Questionnaire submitted! Data: ' + JSON.stringify(data, null, 2));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs at the very top */}
      <nav className="bg-white border-b border-gray-200 px-8 py-3" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              {crumb.path ? (
                <button 
                  onClick={() => window.location.href = crumb.path}
                  className="text-pink-600 hover:text-pink-800 hover:underline focus:outline-none"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Main content area */}
      <div className="py-8">
        <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-pink-700 mb-2">{t('patientQuestionnaire.title')}</h1>
            <p className="text-gray-600">
              {user?.name 
                ? t('patientQuestionnaire.welcomeMessage', { name: user.name })
                : t('patientQuestionnaire.defaultWelcome')
              }
            </p>
          </div>

          <PatientQuestionnaireFlow
            data={data}
            onUpdate={handleUpdate}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            user={user}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export { PatientQuestionnaireFlow };
export default Questionaire;
