import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Building,
  Globe,
  User,
  FileText
} from 'lucide-react';
import { Button, Label, Input } from '../Patient/Questionnaire/UIComponents';

// Single page questionnaire for ASHA Worker registration
function AshaRegistrationForm({ data, onUpdate, onSubmit, isValid, isLoading }) {
  const { t } = useTranslation();
  
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);
    onUpdate({ documents: fileNames });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">{t('ashaQuestionnaire.title')}</h2>
        <p className="text-sm text-gray-600">{t('ashaQuestionnaire.subtitle')}</p>
      </div>
      
      {/* ASHA ID */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <User className="h-4 w-4" />
          {t('ashaQuestionnaire.fields.ashaId.label')} *
        </Label>
        <Input
          type="text"
          placeholder={t('ashaQuestionnaire.fields.ashaId.placeholder')}
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
          {t('ashaQuestionnaire.fields.phc.label')}
        </Label>
        <Input
          type="text"
          placeholder={t('ashaQuestionnaire.fields.phc.placeholder')}
          value={data.phc || ''}
          onChange={e => onUpdate({ phc: e.target.value })}
          className="h-12 text-lg"
        />
      </div>
      
      {/* Village */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <MapPin className="h-4 w-4" />
          {t('ashaQuestionnaire.fields.village.label')}
        </Label>
        <Input
          type="text"
          placeholder={t('ashaQuestionnaire.fields.village.placeholder')}
          value={data.village || ''}
          onChange={e => onUpdate({ village: e.target.value })}
          className="h-12 text-lg"
        />
      </div>
      
      {/* District */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Building className="h-4 w-4" />
          {t('ashaQuestionnaire.fields.district.label')}
        </Label>
        <Input
          type="text"
          placeholder={t('ashaQuestionnaire.fields.district.placeholder')}
          value={data.district || ''}
          onChange={e => onUpdate({ district: e.target.value })}
          className="h-12 text-lg"
        />
      </div>
      
      {/* State */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Globe className="h-4 w-4" />
          {t('ashaQuestionnaire.fields.state.label')}
        </Label>
        <Input
          type="text"
          placeholder={t('ashaQuestionnaire.fields.state.placeholder')}
          value={data.state || ''}
          onChange={e => onUpdate({ state: e.target.value })}
          className="h-12 text-lg"
        />
      </div>

      {/* Documents Upload */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-medium">
          <FileText className="h-4 w-4" />
          {t('ashaQuestionnaire.fields.documents.label')}
        </Label>
        <p className="text-sm text-gray-500">{t('ashaQuestionnaire.fields.documents.description')}</p>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleDocumentUpload}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        {data.documents && data.documents.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700">{t('ashaQuestionnaire.fields.documents.selectedFiles')}</p>
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
        disabled={!isValid || isLoading}
      >
        {isLoading ? t('ashaQuestionnaire.submitting') : t('ashaQuestionnaire.submitButton')}
      </Button>
    </div>
  );
}

// Main wrapper component
function AshaQuestionaire({ onComplete, user, isLoading, error }) {
  const { t } = useTranslation();
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
            <h1 className="text-2xl font-bold text-pink-700 mb-2">{t('ashaQuestionnaire.title')}</h1>
            <p className="text-gray-600">
              {user?.name ? t('ashaQuestionnaire.welcomeMessage', { name: user.name }) : t('ashaQuestionnaire.defaultWelcome')}
            </p>
          </div>

          <AshaRegistrationForm
            data={data}
            onUpdate={handleUpdate}
            onSubmit={handleSubmit}
            isValid={isValid()}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AshaQuestionaire;
