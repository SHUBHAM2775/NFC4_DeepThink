import React, { useState } from "react";
import {
  BellIcon,
  MicrophoneIcon,
  CalendarIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

export default function PatientDashboard() {
  const [contactsOpen, setContactsOpen] = useState(false);

  const emergencyContacts = [
    {
      label: "ASHA Worker: Sunita Devi",
      action: () => alert("Calling ASHA Worker...")
    },
    {
      label: "Nearest Hospital",
      action: () => alert("Calling Hospital...")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative bg-white shadow px-8 py-4 flex items-center justify-between">
        {/* Left side: Title and user */}
        <div>
          <h1 className="text-2xl font-bold text-pink-700">Welcome to Your Health Journey</h1>
          <p className="text-sm text-gray-600">Priya Sharma</p>
        </div>

        {/* Right side: Flex container for Emergency Contacts and Logout */}
        <div className="flex items-center space-x-6">
          {/* Emergency Contacts Dropdown */}
          <div className="relative">
            <button
              onClick={() => setContactsOpen(!contactsOpen)}
              className="flex items-center px-4 py-2 bg-pink-50 border border-pink-200 rounded-lg text-pink-700 font-medium hover:bg-pink-100 transition"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              Emergency Contacts
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>
            {contactsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                {emergencyContacts.map((ec, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <span className="font-semibold text-gray-700">{ec.label}</span>
                    <button
                      onClick={ec.action}
                      className="ml-2 text-pink-600 hover:text-pink-800"
                      aria-label={`Call ${ec.label}`}
                    >
                      <PhoneIcon className="inline h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button className="text-gray-600 hover:text-pink-600">Logout</button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto mt-8 space-y-6 pb-12">
        {/* Emergency Labor */}
        <div className="w-full">
          <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-4 rounded-lg shadow">
            <ExclamationTriangleIcon className="h-6 w-6" />
            Emergency Labor
          </button>
        </div>

        {/* Voice Daily Log */}
        <section className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex items-center gap-2 text-pink-700 font-semibold text-lg">
            <MicrophoneIcon className="h-5 w-5" />
            Voice Daily Log
          </div>
          <p className="text-sm text-gray-500">Record your daily symptoms and feelings</p>
          <button className="w-full mt-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
            <MicrophoneIcon className="h-5 w-5" />
            Start Recording
          </button>
        </section>

        {/* My Reminders */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <BellIcon className="h-5 w-5 text-yellow-400" />
            <span className="font-semibold">My Reminders</span>
          </div>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HeartIcon className="h-6 w-6 text-pink-400" />
                <div>
                  <div className="font-medium text-gray-800">Iron Tablet</div>
                  <div className="text-xs text-gray-500">9:00 AM</div>
                </div>
              </div>
              <span className="px-3 py-0.5 rounded-full text-xs bg-pink-100 text-pink-600 border border-pink-200">
                medication
              </span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-6 w-6 text-blue-400" />
                <div>
                  <div className="font-medium text-gray-800">Doctor Visit</div>
                  <div className="text-xs text-gray-500">Tomorrow 2:00 PM</div>
                </div>
              </div>
              <span className="px-3 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600 border border-blue-200">
                checkup
              </span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HeartIcon className="h-6 w-6 text-green-400" />
                <div>
                  <div className="font-medium text-gray-800">Drink Milk</div>
                  <div className="text-xs text-gray-500">6:00 PM</div>
                </div>
              </div>
              <span className="px-3 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">
                nutrition
              </span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
