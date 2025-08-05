import React from 'react';
import {
  Heart,
  Calendar,
  Users,
  Stethoscope
} from 'lucide-react';
import { Button, Label, Input, RadioGroup, RadioGroupItem } from './UIComponents';

function QuestionnairePage2({ data, onUpdate, onNext, onPrev, isValid }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Pregnancy Information</h2>
        <p className="text-sm text-gray-600">Help us understand your current situation</p>
      </div>
      
      {/* Pregnant */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Heart className="h-4 w-4" />
          Are you currently pregnant?
        </Label>
        <RadioGroup
          name="isPregnant"
          value={data.isPregnant?.toString()}
          onValueChange={val => onUpdate({ isPregnant: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="pregnant-yes">
            Yes
          </RadioGroupItem>
          <RadioGroupItem value="false" id="pregnant-no">
            No
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Months along */}
      {data.isPregnant && (
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Calendar className="h-4 w-4" />
            How many months along are you?
          </Label>
          <Input
            type="number"
            min={1}
            max={9}
            placeholder="Enter months (1-9)"
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
          Is this your first pregnancy?
        </Label>
        <RadioGroup
          name="isFirstPregnancy"
          value={data.isFirstPregnancy?.toString()}
          onValueChange={val => onUpdate({ isFirstPregnancy: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="first-yes">
            Yes
          </RadioGroupItem>
          <RadioGroupItem value="false" id="first-no">
            No
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Doctor/ASHA */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Stethoscope className="h-4 w-4" />
          Have you visited a doctor or ASHA worker during this pregnancy?
        </Label>
        <RadioGroup
          name="hasVisitedDoctor"
          value={data.hasVisitedDoctor?.toString()}
          onValueChange={val => onUpdate({ hasVisitedDoctor: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="visited-yes">
            Yes
          </RadioGroupItem>
          <RadioGroupItem value="false" id="visited-no">
            No
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} className="w-36 h-12 text-lg font-semibold">
          Previous
        </Button>
        <Button onClick={onNext} className="w-44 h-12 text-lg font-semibold" disabled={!isValid}>
          Next Page
        </Button>
      </div>
    </div>
  );
}

export default QuestionnairePage2;
