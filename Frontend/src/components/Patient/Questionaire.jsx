import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PatientQuestionnaireFlow from './Questionnaire/PatientQuestionnaireFlow';

// Wrapper component for usage example
function Questionaire({ onComplete, user }) {
  const { t } = useTranslation();
  const [data, setData] = useState({});

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
    <div className="min-h-screen bg-gray-50 py-8">
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
          />
        </div>
      </div>
    </div>
  );
}

export { PatientQuestionnaireFlow };
export default Questionaire;
