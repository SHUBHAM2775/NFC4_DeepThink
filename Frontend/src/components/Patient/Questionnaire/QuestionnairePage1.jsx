import React from 'react';
import {
  MapPin,
  Building,
  Globe
} from 'lucide-react';
import { Button, Label, Input } from './UIComponents';

function QuestionnairePage1({ data, onUpdate, onNext, isValid }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Location Information</h2>
        <p className="text-sm text-gray-600">Please provide your location details</p>
      </div>
      
      {/* Village */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <MapPin className="h-4 w-4" />
          Village
        </Label>
        <Input
          type="text"
          placeholder="Enter your village name"
          value={data.village || ''}
          onChange={e => onUpdate({ village: e.target.value })}
          className="h-12 text-lg"
        />
      </div>
      
      {/* District */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Building className="h-4 w-4" />
          District
        </Label>
        <Input
          type="text"
          placeholder="Enter your district name"
          value={data.district || ''}
          onChange={e => onUpdate({ district: e.target.value })}
          className="h-12 text-lg"
        />
      </div>
      
      {/* State */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Globe className="h-4 w-4" />
          State
        </Label>
        <Input
          type="text"
          placeholder="Enter your state name"
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
        Proceed to Questions
      </Button>
    </div>
  );
}

export default QuestionnairePage1;
