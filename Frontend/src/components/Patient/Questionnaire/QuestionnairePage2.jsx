import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Calendar,
  Users,
  Stethoscope
} from 'lucide-react';
import { Button, Label, Input, RadioGroup, RadioGroupItem } from './UIComponents';

function QuestionnairePage2({ data, onUpdate, onNext, onPrev, isValid }) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">{t('patientQuestionnaire.pages.page2.title')}</h2>
        <p className="text-sm text-gray-600">{t('patientQuestionnaire.pages.page2.subtitle')}</p>
      </div>
      
      {/* Pregnant */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Heart className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page2.isPregnant.label')}
        </Label>
        <RadioGroup
          name="isPregnant"
          value={data.isPregnant?.toString()}
          onValueChange={val => onUpdate({ isPregnant: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="pregnant-yes">
            {t('patientQuestionnaire.pages.page2.isPregnant.yes')}
          </RadioGroupItem>
          <RadioGroupItem value="false" id="pregnant-no">
            {t('patientQuestionnaire.pages.page2.isPregnant.no')}
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Months along */}
      {data.isPregnant && (
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Calendar className="h-4 w-4" />
            {t('patientQuestionnaire.pages.page2.monthsAlong.label')}
          </Label>
          <Input
            type="number"
            min={1}
            max={9}
            placeholder={t('patientQuestionnaire.pages.page2.monthsAlong.placeholder')}
            value={data.monthsAlong || ''}
            onChange={e => onUpdate({ monthsAlong: parseInt(e.target.value) || undefined })}
            className="h-12 text-lg"
          />
        </div>
      )}
      
      {/* First pregnancy */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Users className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page2.isFirstPregnancy.label')}
        </Label>
        <RadioGroup
          name="isFirstPregnancy"
          value={data.isFirstPregnancy?.toString()}
          onValueChange={val => onUpdate({ isFirstPregnancy: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="first-yes">
            {t('patientQuestionnaire.pages.page2.isFirstPregnancy.yes')}
          </RadioGroupItem>
          <RadioGroupItem value="false" id="first-no">
            {t('patientQuestionnaire.pages.page2.isFirstPregnancy.no')}
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Doctor/ASHA */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Stethoscope className="h-4 w-4" />
          {t('patientQuestionnaire.pages.page2.hasVisitedDoctor.label')}
        </Label>
        <RadioGroup
          name="hasVisitedDoctor"
          value={data.hasVisitedDoctor?.toString()}
          onValueChange={val => onUpdate({ hasVisitedDoctor: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="visited-yes">
            {t('patientQuestionnaire.pages.page2.hasVisitedDoctor.yes')}
          </RadioGroupItem>
          <RadioGroupItem value="false" id="visited-no">
            {t('patientQuestionnaire.pages.page2.hasVisitedDoctor.no')}
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} className="w-36 h-12 text-lg font-semibold">
          {t('patientQuestionnaire.pages.page2.previousButton')}
        </Button>
        <Button onClick={onNext} className="w-44 h-12 text-lg font-semibold" disabled={!isValid}>
          {t('patientQuestionnaire.pages.page2.nextButton')}
        </Button>
      </div>
    </div>
  );
}

export default QuestionnairePage2;
