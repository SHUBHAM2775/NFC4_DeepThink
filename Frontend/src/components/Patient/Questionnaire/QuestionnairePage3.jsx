import React from 'react';
import {
  Heart,
  AlertTriangle,
  Pill,
  Phone
} from 'lucide-react';
import { Button, Label, RadioGroup, RadioGroupItem } from './UIComponents';

function QuestionnairePage3({ data, onUpdate, onNext, onPrev, isValid }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Health & Emergency Information</h2>
        <p className="text-sm text-gray-600">Help us understand your health status and emergency preparedness</p>
      </div>
      
      {/* Health Issues */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Heart className="h-4 w-4" />
          Do you have any known health issues?
        </Label>
        <p className="text-sm text-gray-500">e.g. diabetes, high blood pressure, anemia</p>
        <RadioGroup
          name="hasHealthIssues"
          value={data.hasHealthIssues}
          onValueChange={val => onUpdate({ hasHealthIssues: val })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="health-yes">
            Yes
          </RadioGroupItem>
          <RadioGroupItem value="false" id="health-no">
            No
          </RadioGroupItem>
          <RadioGroupItem value="unsure" id="health-unsure">
            Not sure
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Recent symptoms */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <AlertTriangle className="h-4 w-4" />
          Have you experienced bleeding, pain, or swelling recently?
        </Label>
        <RadioGroup
          name="hasRecentSymptoms"
          value={data.hasRecentSymptoms?.toString()}
          onValueChange={val => onUpdate({ hasRecentSymptoms: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="symptoms-yes">
            Yes
          </RadioGroupItem>
          <RadioGroupItem value="false" id="symptoms-no">
            No
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Prenatal vitamins */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Pill className="h-4 w-4" />
          Are you currently taking prenatal vitamins or iron supplements?
        </Label>
        <RadioGroup
          name="takingVitamins"
          value={data.takingVitamins?.toString()}
          onValueChange={val => onUpdate({ takingVitamins: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="vitamins-yes">
            Yes
          </RadioGroupItem>
          <RadioGroupItem value="false" id="vitamins-no">
            No
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      {/* Mobile access */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Phone className="h-4 w-4" />
          Do you have access to a mobile phone during emergencies?
        </Label>
        <RadioGroup
          name="hasMobileAccess"
          value={data.hasMobileAccess?.toString()}
          onValueChange={val => onUpdate({ hasMobileAccess: val === 'true' })}
          className="space-y-3"
        >
          <RadioGroupItem value="true" id="mobile-yes">
            Yes
          </RadioGroupItem>
          <RadioGroupItem value="false" id="mobile-no">
            No
          </RadioGroupItem>
        </RadioGroup>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} className="w-36 h-12 text-lg font-semibold">
          Previous
        </Button>
        <Button onClick={onNext} className="w-44 h-12 text-lg font-semibold" disabled={!isValid}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default QuestionnairePage3;
