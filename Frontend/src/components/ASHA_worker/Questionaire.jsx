import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Globe,
  User,
  FileText
} from 'lucide-react';
import { Button, Label, Input } from '../Patient/Questionnaire/UIComponents';

// Single page questionnaire for ASHA Worker registration
function AshaRegistrationForm({ data, onUpdate, onSubmit, isValid }) {
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);
    onUpdate({ documents: fileNames });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">ASHA Worker Registration</h2>
        <p className="text-sm text-gray-600">Please provide your professional details</p>
      </div>
      
      {/* ASHA ID */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <User className="h-4 w-4" />
          ASHA ID *
        </Label>
        <Input
          type="text"
          placeholder="Enter your unique ASHA ID"
          value={data.ashaId || ''}
          onChange={e => onUpdate({ ashaId: e.target.value })}
          className="h-12 text-lg"
          required
        />
      </div>

      {/* PHC */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Building className="h-4 w-4" />
          Primary Health Centre (PHC)
        </Label>
        <Input
          type="text"
          placeholder="Enter your associated PHC name"
          value={data.phc || ''}
          onChange={e => onUpdate({ phc: e.target.value })}
          className="h-12 text-lg"
        />
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

      {/* Documents Upload */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <FileText className="h-4 w-4" />
          Upload Documents
        </Label>
        <p className="text-sm text-gray-500">Upload verification documents (certificates, ID proofs, etc.)</p>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleDocumentUpload}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        {data.documents && data.documents.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700">Selected files:</p>
            <ul className="text-sm text-gray-600">
              {data.documents.map((doc, index) => (
                <li key={index} className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Button
        onClick={onSubmit}
        className="w-full h-12 text-lg font-semibold"
        disabled={!isValid}
      >
        Complete Registration
      </Button>
    </div>
  );
}

// Main wrapper component
function AshaQuestionaire({ onComplete, user }) {
  const [data, setData] = useState({});

  const handleUpdate = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = () => {
    if (onComplete) {
      onComplete(data);
    } else {
      alert('ASHA Worker Registration completed! Data: ' + JSON.stringify(data, null, 2));
    }
  };

  // Validation: Only ASHA ID is required, others are optional
  const isValid = () => {
    return data.ashaId && data.ashaId.trim() !== '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-pink-700 mb-2">ASHA Worker Registration</h1>
            <p className="text-gray-600">Welcome {user?.name || 'ASHA Worker'}! Please complete your registration details.</p>
          </div>

          <AshaRegistrationForm
            data={data}
            onUpdate={handleUpdate}
            onSubmit={handleSubmit}
            isValid={isValid()}
          />
        </div>
      </div>
    </div>
  );
}

export default AshaQuestionaire;
