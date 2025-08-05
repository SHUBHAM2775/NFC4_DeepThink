import React, { useState } from 'react';
import { QuestionnairePage1, QuestionnairePage2, QuestionnairePage3 } from './index';

function PatientQuestionnaireFlow({ data, onUpdate, onSubmit }) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleFinalSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  // Validation logic for each page
  const isPage1Valid = () => {
    return data.village && data.district && data.state;
  };

  const isPage2Valid = () => {
    return data.isPregnant !== undefined && 
           data.isFirstPregnancy !== undefined && 
           data.hasVisitedDoctor !== undefined &&
           (!data.isPregnant || (data.isPregnant && data.monthsAlong));
  };

  const isPage3Valid = () => {
    return data.hasHealthIssues !== undefined && 
           data.hasRecentSymptoms !== undefined && 
           data.takingVitamins !== undefined && 
           data.hasMobileAccess !== undefined;
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <QuestionnairePage1
            data={data}
            onUpdate={onUpdate}
            onNext={handleNext}
            isValid={isPage1Valid()}
          />
        );
      case 2:
        return (
          <QuestionnairePage2
            data={data}
            onUpdate={onUpdate}
            onNext={handleNext}
            onPrev={handlePrev}
            isValid={isPage2Valid()}
          />
        );
      case 3:
        return (
          <QuestionnairePage3
            data={data}
            onUpdate={onUpdate}
            onNext={handleFinalSubmit}
            onPrev={handlePrev}
            isValid={isPage3Valid()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((page) => (
            <div key={page} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  page <= currentPage
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {page}
              </div>
              {page < 3 && (
                <div
                  className={`w-8 h-1 mx-2 ${
                    page < currentPage ? 'bg-pink-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current page content */}
      {renderCurrentPage()}
    </div>
  );
}

export default PatientQuestionnaireFlow;
