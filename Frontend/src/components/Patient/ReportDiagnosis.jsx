import React, { useState } from "react";
import { ArrowDownTrayIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ReportDiagnosis() {
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex flex-col items-center py-12 px-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-pink-600 mb-10 select-none" aria-label="Breadcrumb">
        <span className="cursor-pointer hover:underline">Home</span>
        <ChevronRightIcon className="h-4 w-4 text-pink-400" />
        <span className="cursor-pointer hover:underline">Reports</span>
        <ChevronRightIcon className="h-4 w-4 text-pink-400" />
        <span className="font-semibold text-pink-700">Upload Diagnosis</span>
      </nav>

      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8">
        {!selectedFile ? (
          <div
            className="flex flex-col items-center justify-center space-y-5 border-2 border-dashed border-pink-300 bg-pink-50 hover:bg-pink-100 transition cursor-pointer rounded-xl h-64"
            onClick={() => document.getElementById("fileUpload").click()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setSelectedFile(e.dataTransfer.files[0]);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <ArrowDownTrayIcon className="h-12 w-12 text-pink-600" />
            <p className="text-pink-700 font-semibold text-lg">Click to upload or drag & drop your maternity report</p>
            <p className="text-pink-400 text-sm">(Accepted file types: .pdf, .jpg, .png)</p>
          </div>
        ) : (
          <div className="space-y-6">
            <label
              htmlFor="fileUpload"
              className="file-input file-input-bordered file-input-pink w-full max-w-xs cursor-pointer"
              aria-label="Upload another file"
            >
              Select Another File
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div>
              <h3 className="text-xl font-semibold text-pink-700 mb-3">Preview:</h3>
              <div className="border rounded-lg shadow-lg overflow-hidden max-h-[28rem] bg-white flex justify-center items-center">
                {selectedFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="object-contain max-h-96 w-full"
                  />
                ) : selectedFile.type === "application/pdf" ? (
                  <iframe
                    src={URL.createObjectURL(selectedFile)}
                    title="PDF Preview"
                    className="w-full h-96"
                  />
                ) : (
                  <p className="text-red-600 p-6 font-semibold">Unsupported file type</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hidden input for uploading */}
        <input
          id="fileUpload"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
