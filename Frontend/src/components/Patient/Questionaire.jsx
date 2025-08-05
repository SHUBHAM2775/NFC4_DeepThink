import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  Users,
  Stethoscope,
  AlertTriangle,
  Pill,
  Phone,
  CheckCircle
} from 'lucide-react';

// Custom UI Components
const Button = ({ children, onClick, className = '', disabled, ...props }) => (
  <button 
    onClick={onClick} 
    className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

const Label = ({ children, className = '', htmlFor, ...props }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
);

const Input = ({ className = '', ...props }) => (
  <input 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${className}`}
    {...props}
  />
);

const RadioGroup = ({ children, value, onValueChange, className = '' }) => (
  <div className={className}>
    {React.Children.map(children, (child, index) => 
      React.cloneElement(child, { 
        groupValue: value, 
        onGroupChange: onValueChange,
        key: index 
      })
    )}
  </div>
);

const RadioGroupItem = ({ value, id, groupValue, onGroupChange }) => (
  <input
    type="radio"
    id={id}
    name={id + '_group'} // Add name attribute for grouping
    value={value}
    checked={groupValue === value}
    onChange={() => onGroupChange && onGroupChange(value)}
    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 cursor-pointer"
  />
);

function PatientQuestionnaireFlow({ data, onUpdate, onSubmit }) {
  const [page, setPage] = useState(0);

  // Page 1 validation
  function isPage1Valid() {
    if (
      data.isPregnant === undefined ||
      data.isFirstPregnancy === undefined ||
      data.hasVisitedDoctor === undefined
    ) return false;
    if (data.isPregnant && (!data.monthsAlong || data.monthsAlong < 1 || data.monthsAlong > 9)) return false;
    return true;
  }

  // Page 2 validation
  function isPage2Valid() {
    return (
      data.hasHealthIssues !== undefined &&
      data.hasRecentSymptoms !== undefined &&
      data.takingVitamins !== undefined &&
      data.hasMobileAccess !== undefined
    );
  }

  // Page 3 validation
  function isPage3Valid() {
    return (
      data.feelsBabyMovementToday !== undefined &&
      data.nutritiousFoodToday !== undefined &&
      data.emergencyReady !== undefined &&
      data.familySupportReminders !== undefined
    );
  }

  const progressPercent = ((page + 1) / 3) * 100;

  const handleNext = () => {
    if (page === 0 && isPage1Valid()) setPage(1);
    if (page === 1 && isPage2Valid()) setPage(2);
  };
  const handlePrev = () => setPage(Math.max(0, page - 1));

  return (
    <div className="max-w-lg mx-auto mt-10 font-sans">
      {/* Progress Bar */}
      <div className="h-3 w-full bg-gray-200 rounded-full mb-6 overflow-hidden" role="progressbar" aria-label="progress">
        <div
          className="h-full bg-green-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* --- PAGE 1 --- */}
      {page === 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Pregnancy Information</h2>
            <p className="text-sm text-muted-foreground">Help us understand your current situation</p>
          </div>
          {/* Pregnant */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Heart className="h-4 w-4" />
              Are you currently pregnant?
            </Label>
            <RadioGroup
              value={data.isPregnant?.toString()}
              onValueChange={val => onUpdate({ isPregnant: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="true" id="pregnant-yes" />
                <Label htmlFor="pregnant-yes" className="cursor-pointer flex-1">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="false" id="pregnant-no" />
                <Label htmlFor="pregnant-no" className="cursor-pointer flex-1">No</Label>
              </div>
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
              value={data.isFirstPregnancy?.toString()}
              onValueChange={val => onUpdate({ isFirstPregnancy: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="true" id="first-yes" />
                <Label htmlFor="first-yes" className="cursor-pointer flex-1">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="false" id="first-no" />
                <Label htmlFor="first-no" className="cursor-pointer flex-1">No</Label>
              </div>
            </RadioGroup>
          </div>
          {/* Doctor/ASHA */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Stethoscope className="h-4 w-4" />
              Have you visited a doctor or ASHA worker during this pregnancy?
            </Label>
            <RadioGroup
              value={data.hasVisitedDoctor?.toString()}
              onValueChange={val => onUpdate({ hasVisitedDoctor: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="true" id="visited-yes" />
                <Label htmlFor="visited-yes" className="cursor-pointer flex-1">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="false" id="visited-no" />
                <Label htmlFor="visited-no" className="cursor-pointer flex-1">No</Label>
              </div>
            </RadioGroup>
          </div>
          <Button
            onClick={handleNext}
            className="w-full h-12 text-lg font-semibold"
            disabled={!isPage1Valid()}
          >
            Continue to Health & Emergency
          </Button>
        </div>
      )}

      {/* --- PAGE 2 --- */}
      {page === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Health & Emergency Information</h2>
            <p className="text-sm text-muted-foreground">Help us understand your health status and emergency preparedness</p>
          </div>
          {/* Health Issues */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Heart className="h-4 w-4" />
              Do you have any known health issues?
            </Label>
            <p className="text-sm text-muted-foreground">e.g. diabetes, high blood pressure, anemia</p>
            <RadioGroup
              value={data.hasHealthIssues}
              onValueChange={val => onUpdate({ hasHealthIssues: val })}
              className="grid grid-cols-3 gap-2"
            >
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="true" id="health-yes" />
                <Label htmlFor="health-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="false" id="health-no" />
                <Label htmlFor="health-no" className="cursor-pointer">No</Label>
              </div>
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="unsure" id="health-unsure" />
                <Label htmlFor="health-unsure" className="cursor-pointer">Not sure</Label>
              </div>
            </RadioGroup>
          </div>
          {/* Recent symptoms */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <AlertTriangle className="h-4 w-4" />
              Have you experienced bleeding, pain, or swelling recently?
            </Label>
            <RadioGroup
              value={data.hasRecentSymptoms?.toString()}
              onValueChange={val => onUpdate({ hasRecentSymptoms: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="true" id="symptoms-yes" />
                <Label htmlFor="symptoms-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="false" id="symptoms-no" />
                <Label htmlFor="symptoms-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
          {/* Prenatal vitamins */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Pill className="h-4 w-4" />
              Are you currently taking prenatal vitamins or iron supplements?
            </Label>
            <RadioGroup
              value={data.takingVitamins?.toString()}
              onValueChange={val => onUpdate({ takingVitamins: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="true" id="vitamins-yes" />
                <Label htmlFor="vitamins-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="false" id="vitamins-no" />
                <Label htmlFor="vitamins-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
          {/* Mobile access */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Phone className="h-4 w-4" />
              Do you have access to a mobile phone during emergencies?
            </Label>
            <RadioGroup
              value={data.hasMobileAccess?.toString()}
              onValueChange={val => onUpdate({ hasMobileAccess: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="true" id="mobile-yes" />
                <Label htmlFor="mobile-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="false" id="mobile-no" />
                <Label htmlFor="mobile-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-between">
            <Button onClick={handlePrev} className="w-36 h-12 text-lg font-semibold">Previous</Button>
            <Button onClick={handleNext} className="w-44 h-12 text-lg font-semibold" disabled={!isPage2Valid()}>
              Continue to Daily Health
            </Button>
          </div>
        </div>
      )}

      {/* --- PAGE 3 --- */}
      {page === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Daily Health & Support</h2>
            <p className="text-sm text-muted-foreground">
              Track fetal movement, nutrition, and family support
            </p>
          </div>
          {/* Baby movement */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <CheckCircle className="h-4 w-4" />
              Have you felt the baby move today?
            </Label>
            <RadioGroup
              value={data.feelsBabyMovementToday?.toString()}
              onValueChange={val => onUpdate({ feelsBabyMovementToday: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="true" id="babyMove-yes" />
                <Label htmlFor="babyMove-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="false" id="babyMove-no" />
                <Label htmlFor="babyMove-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
          {/* Nutrition */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <CheckCircle className="h-4 w-4" />
              Did you eat nutritious food today? (fruits, vegetables, protein)
            </Label>
            <RadioGroup
              value={data.nutritiousFoodToday?.toString()}
              onValueChange={val => onUpdate({ nutritiousFoodToday: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="true" id="nutrition-yes" />
                <Label htmlFor="nutrition-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="false" id="nutrition-no" />
                <Label htmlFor="nutrition-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
          {/* Emergency Button */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Phone className="h-4 w-4" />
              Do you have easy access to an emergency labor button on your phone?
            </Label>
            <RadioGroup
              value={data.emergencyReady?.toString()}
              onValueChange={val => onUpdate({ emergencyReady: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="true" id="emergency-yes" />
                <Label htmlFor="emergency-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="false" id="emergency-no" />
                <Label htmlFor="emergency-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
          {/* Family Support */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Users className="h-4 w-4" />
              Do your family members remind you to attend check-ups and take medicines?
            </Label>
            <RadioGroup
              value={data.familySupportReminders?.toString()}
              onValueChange={val => onUpdate({ familySupportReminders: val === 'true' })}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="true" id="familySupport-yes" />
                <Label htmlFor="familySupport-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center border rounded-lg p-3">
                <RadioGroupItem value="false" id="familySupport-no" />
                <Label htmlFor="familySupport-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-between">
            <Button onClick={handlePrev} className="w-36 h-12 text-lg font-semibold">Previous</Button>
            <Button
              onClick={onSubmit}
              className="w-44 h-12 text-lg font-semibold"
              disabled={!isPage3Valid()}
            >
              Submit Questionnaire
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper component for App.jsx compatibility
function Questionaire({ onComplete, user }) {
  const [data, setData] = useState({});

  const handleUpdate = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = () => {
    // Call onComplete with the questionnaire data
    if (onComplete) {
      onComplete(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-700 mb-2">Health Questionnaire</h1>
            <p className="text-gray-600">Welcome {user?.name}! Please answer a few questions about your health.</p>
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
