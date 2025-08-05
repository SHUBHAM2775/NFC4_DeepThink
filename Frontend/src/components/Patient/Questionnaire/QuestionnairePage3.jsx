import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  AlertTriangle,
  Pill,
  Phone
} from 'lucide-react';
import { Button, Label, RadioGroup, RadioGroupItem } from './UIComponents';

function QuestionnairePage3({ data, onUpdate, onNext, onPrev, isValid, isLoading, user }) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">{t('patientQuestionnaire.pages.page3.title')}</h2>
        <p className="text-sm text-gray-600">{t('patientQuestionnaire.pages.page3.subtitle')}</p>
      </div>
      
      {/* Health Issues */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Heart className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page3.hasHealthIssues.label')}
        </Label>
        <p className="text-sm text-gray-500">{t('patientQuestionnaire.pages.page3.hasHealthIssues.description')}</p>
        <RadioGroup
          name="hasHealthIssues"
          value={data.hasHealthIssues}
          onValueChange={val => onUpdate({ hasHealthIssues: val })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="health-yes">
            {t('patientQuestionnaire.pages.page3.hasHealthIssues.yes')}
          </RadioGroupItem>
          <RadioGroupItem value="false" id="health-no">
            {t('patientQuestionnaire.pages.page3.hasHealthIssues.no')}
          </RadioGroupItem>
          <RadioGroupItem value="unsure" id="health-unsure">
            {t('patientQuestionnaire.pages.page3.hasHealthIssues.unsure')}
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Recent symptoms */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <AlertTriangle className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page3.hasRecentSymptoms.label')}
        </Label>
        <RadioGroup
          name="hasRecentSymptoms"
          value={data.hasRecentSymptoms?.toString()}
          onValueChange={val => onUpdate({ hasRecentSymptoms: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="symptoms-yes">
            {t('patientQuestionnaire.pages.page3.hasRecentSymptoms.yes')}
          </RadioGroupItem>
          <RadioGroupItem value="false" id="symptoms-no">
            {t('patientQuestionnaire.pages.page3.hasRecentSymptoms.no')}
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Prenatal vitamins */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Pill className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page3.takingVitamins.label')}
        </Label>
        <RadioGroup
          name="takingVitamins"
          value={data.takingVitamins?.toString()}
          onValueChange={val => onUpdate({ takingVitamins: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="vitamins-yes">
            {t('patientQuestionnaire.pages.page3.takingVitamins.yes')}
          </RadioGroupItem>
          <RadioGroupItem value="false" id="vitamins-no">
            {t('patientQuestionnaire.pages.page3.takingVitamins.no')}
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Mobile access */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Phone className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page3.hasMobileAccess.label')}
        </Label>
        <RadioGroup
          name="hasMobileAccess"
          value={data.hasMobileAccess?.toString()}
          onValueChange={val => onUpdate({ hasMobileAccess: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="mobile-yes">
            {t('patientQuestionnaire.pages.page3.hasMobileAccess.yes')}
          </RadioGroupItem>
          <RadioGroupItem value="false" id="mobile-no">
            {t('patientQuestionnaire.pages.page3.hasMobileAccess.no')}
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} className="w-36 h-12 text-lg font-semibold" disabled={isLoading}>
          {t('patientQuestionnaire.pages.page3.previousButton')}
        </Button>
        <Button onClick={onNext} className="w-44 h-12 text-lg font-semibold" disabled={!isValid || isLoading}>
          {isLoading ? t('patientQuestionnaire.pages.page3.submitting') : t('patientQuestionnaire.pages.page3.submitButton')}
        </Button>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionnairePage3;
