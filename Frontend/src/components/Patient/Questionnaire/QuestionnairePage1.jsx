import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Building,
  Globe
} from 'lucide-react';
import { Button, Label, Input } from './UIComponents';

function QuestionnairePage1({ data, onUpdate, onNext, isValid, user }) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">{t('patientQuestionnaire.pages.page1.title')}</h2>
        <p className="text-sm text-gray-600">{t('patientQuestionnaire.pages.page1.subtitle')}</p>
      </div>
      
      {/* Village */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <MapPin className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page1.village.label')}
        </Label>
        <Input
          type="text"
          placeholder={t('patientQuestionnaire.pages.page1.village.placeholder')}
          value={data.village || ''}
          onChange={e => onUpdate({ village: e.target.value })}
          className="h-12 text-lg"
        />
      </div>
      
      {/* District */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Building className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page1.district.label')}
        </Label>
        <Input
          type="text"
          placeholder={t('patientQuestionnaire.pages.page1.district.placeholder')}
          value={data.district || ''}
          onChange={e => onUpdate({ district: e.target.value })}
          className="h-12 text-lg"
        />
      </div>
      
      {/* State */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Globe className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page1.state.label')}
        </Label>
        <Input
          type="text"
          placeholder={t('patientQuestionnaire.pages.page1.state.placeholder')}
          value={data.state || ''}
          onChange={e => onUpdate({ state: e.target.value })}
          className="h-12 text-lg"
        />
      </div>
      
      <Button
        onClick={onNext}
        className="w-full h-12 text-lg font-semibold"
        disabled={!isValid}
      >
        {t('patientQuestionnaire.pages.page1.nextButton')}
      </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionnairePage1;
