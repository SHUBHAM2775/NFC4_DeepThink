import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  ArrowLeftIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import LanguageSwitcher from '../LanguageSwitcher';

export default function ReportAnalysis({ onBack }) {
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Logout handler
  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    window.location.href = "/";
  }

  // File upload handlers
  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: null
    }));

    // Create preview for images
    newFiles.forEach(fileObj => {
      if (fileObj.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === fileObj.id ? { ...f, preview: e.target.result } : f)
          );
        };
        reader.readAsDataURL(fileObj.file);
      }
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file to analyze.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis (replace with actual API call)
    setTimeout(() => {
      setAnalysisResults({
        summary: "Analysis completed successfully. The uploaded reports show normal values for most parameters.",
        findings: [
          { parameter: "Hemoglobin", value: "11.5 g/dl", status: "normal", recommendation: "Maintain current iron intake" },
          { parameter: "Blood Pressure", value: "120/80 mmHg", status: "normal", recommendation: "Continue monitoring" },
          { parameter: "Blood Sugar", value: "95 mg/dl", status: "normal", recommendation: "Maintain healthy diet" },
          { parameter: "Protein in Urine", value: "Trace", status: "attention", recommendation: "Monitor closely, consult doctor" }
        ],
        recommendations: [
          "Continue taking prescribed iron supplements",
          "Monitor blood pressure weekly",
          "Follow up with doctor for protein levels",
          "Maintain balanced diet and regular exercise"
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  // Upload UI Component
  const UploadSection = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-pink-700 mb-4">
          Upload Medical Reports
        </h2>
        <p className="text-gray-600">
          Upload your medical reports for AI-powered analysis and insights
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-pink-500 bg-pink-50' 
            : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <div className="text-xl font-semibold text-gray-700 mb-2">
          Drop your files here, or click to browse
        </div>
        <div className="text-sm text-gray-500 mb-6">
          Supports: PDF, JPG, PNG, DOCX (Max 10MB per file)
        </div>
        
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
          onChange={handleFileInputChange}
        />
        
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 cursor-pointer transition-colors"
        >
          <CloudArrowUpIcon className="h-5 w-5 mr-2" />
          Choose Files
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Analyze Reports
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 hover:text-pink-600 rounded-md transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-pink-700">
              Report Analysis
            </h1>
            <p className="text-sm text-gray-600">AI-powered medical report insights</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {uploadedFiles.length === 0 ? (
          <UploadSection />
        ) : (
          <div className="space-y-6">
            {/* Upload Section - Compact */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Upload More Files</h3>
                <label
                  htmlFor="additional-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 cursor-pointer transition-colors"
                >
                  <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                  Add Files
                </label>
                <input
                  type="file"
                  id="additional-upload"
                  className="hidden"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                  onChange={handleFileInputChange}
                />
              </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  isDragOver 
                    ? 'border-pink-500 bg-pink-50' 
                    : 'border-gray-300 hover:border-pink-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Drop additional files here or click "Add Files"</p>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                {uploadedFiles.length > 0 && !analysisResults && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Analyze Reports
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {uploadedFiles.map((fileObj) => (
                  <div key={fileObj.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate" title={fileObj.name}>
                          {fileObj.name}
                        </h4>
                        <p className="text-xs text-gray-500">{formatFileSize(fileObj.size)}</p>
                      </div>
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* File Preview */}
                    <div className="bg-gray-50 rounded-md p-3 mb-3">
                      {fileObj.preview ? (
                        <img
                          src={fileObj.preview}
                          alt={fileObj.name}
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors">
                        <EyeIcon className="h-3 w-3 inline mr-1" />
                        Preview
                      </button>
                      <button 
                        onClick={() => removeFile(fileObj.id)}
                        className="flex-1 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <TrashIcon className="h-3 w-3 inline mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Results */}
            {analysisResults && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Results</h3>
                
                {/* Summary */}
                <div className="mb-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                  <h4 className="font-medium text-pink-800 mb-2">Summary</h4>
                  <p className="text-pink-700">{analysisResults.summary}</p>
                </div>

                {/* Findings */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Key Findings</h4>
                  <div className="space-y-3">
                    {analysisResults.findings.map((finding, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        finding.status === 'normal' 
                          ? 'bg-pink-50 border-pink-200' 
                          : 'bg-orange-50 border-orange-200'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium">{finding.parameter}:</span>
                            <span className="ml-2">{finding.value}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            finding.status === 'normal' 
                              ? 'bg-pink-100 text-pink-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {finding.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{finding.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysisResults.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
