import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  BellIcon,
  MicrophoneIcon,
  CalendarIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ChevronDownIcon,
  XMarkIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import LanguageSwitcher from '../LanguageSwitcher';
import AssistantHover from '../AssistantHover';
import { getNearbyAshaWorkers, assignAshaWorker } from '../../services/pregnantLadyAPI';

export default function PatientDashboard({ onNavigateToVoiceLog }) {
  const { t } = useTranslation();
  
  const defaultContacts = [
    { id: 1, label: t('patientDashboard.defaultContacts.ashaWorker'), number: "+91 98765 43210" },
    { id: 2, label: t('patientDashboard.defaultContacts.nearestHospital'), number: "+91 12345 67890" },
  ];

  // State for emergency contacts, initialized from localStorage or defaults
  const [contacts, setContacts] = useState(() => {
    try {
      const stored = localStorage.getItem("emergencyContacts");
      return stored ? JSON.parse(stored) : defaultContacts;
    } catch (e) {
      return defaultContacts;
    }
  });

  const [contactsOpen, setContactsOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // State for nearby ASHA workers
  const [nearbyAshaWorkers, setNearbyAshaWorkers] = useState([]);
  const [loadingAshaWorkers, setLoadingAshaWorkers] = useState(true);
  const [ashaWorkersError, setAshaWorkersError] = useState(null);

  // Hardcoded pregnant lady ID for demo purposes
  const pregnantLadyId = "6892683647b1656bc9d5f7ea";

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
  }, [contacts]);

  // Fetch nearby ASHA workers on component mount
  useEffect(() => {
    const fetchNearbyAshaWorkers = async () => {
      try {
        setLoadingAshaWorkers(true);
        const data = await getNearbyAshaWorkers(pregnantLadyId);
        setNearbyAshaWorkers(data.ashaWorkers || []);
        setAshaWorkersError(null);
      } catch (error) {
        console.error('Error fetching nearby ASHA workers:', error);
        setAshaWorkersError(error.message || 'Failed to load ASHA workers');
      } finally {
        setLoadingAshaWorkers(false);
      }
    };

    fetchNearbyAshaWorkers();
  }, [pregnantLadyId]);

  // Add new contact handler
  function handleAddContact() {
    if (!newName.trim()) {
      alert(t('patientDashboard.emergencyContactsModal.enterContactName'));
      return;
    }
    // Add unique id using max id + 1 or timestamp
    const newContact = {
      id: Date.now(),
      label: newName.trim(),
      number: newNumber.trim() || "N/A",
    };
    setContacts((prev) => [...prev, newContact]);
    setNewName("");
    setNewNumber("");
    setAddModalOpen(false);
  }

  // Delete contact handler
  function handleDeleteContact(id) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  // Logout handler
  function handleLogout() {
    // Clear any stored authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    // Redirect to login page
    window.location.href = "/";
  }

  // Handle ASHA worker contact
  async function handleContactAshaWorker(worker) {
    try {
      // Call the assigned API
      const assignmentData = {
        pregnantLadyId: pregnantLadyId,
        ashaWorkerId: worker._id
      };
      
      await assignAshaWorker(assignmentData);
      console.log('ASHA worker assigned successfully');
      
      // Show success alert
      alert(`Successfully assigned to ASHA worker: ${worker.name}`);
      
    } catch (error) {
      console.error('Error assigning ASHA worker:', error);
      // Show error alert
      alert('Failed to assign ASHA worker. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header with Emergency Contacts Dropdown and Logout */}
      <div className="relative bg-white shadow px-8 py-4 flex items-center justify-between">
        {/* Title and User */}
        <div>
          <h1 className="text-2xl font-bold text-pink-700">
            {t('patientDashboard.welcomeMessage')}
          </h1>
          <p className="text-sm text-gray-600">{t('patientDashboard.userName')}</p>
        </div>

        {/* Right Controls: Language Switcher + Emergency Contacts + Logout */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
          {/* Emergency Contacts Dropdown */}
          <div className="relative">
            <button
              onClick={() => setContactsOpen(!contactsOpen)}
              className="flex items-center px-4 py-2 bg-pink-50 border border-pink-200 rounded-lg text-pink-700 font-medium hover:bg-pink-100 transition"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              {t('patientDashboard.emergencyContacts')}
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>

            {contactsOpen && (
              <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                {contacts.length === 0 && (
                  <p className="text-gray-500">{t('patientDashboard.emergencyContactsModal.noContacts')}</p>
                )}
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between mb-2"
                  >
                    <div>
                      <div className="font-semibold text-gray-700">
                        {contact.label}
                      </div>
                      {contact.number !== "N/A" && (
                        <div className="text-xs text-gray-500">{contact.number}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      aria-label={`Delete ${contact.label}`}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                {/* Add Contact Button */}
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="w-full mt-3 px-3 py-1.5 bg-pink-100 hover:bg-pink-200 rounded-md text-pink-700 font-medium"
                >
                  {t('patientDashboard.emergencyContactsModal.addContact')}
                </button>
              </div>
            )}
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md font-medium transition-colors"
          >
            {t('patientDashboard.logout')}
          </button>
        </div>
      </div>

      {/* Add Contact Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-20 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-pink-700 mb-4">
              {t('patientDashboard.emergencyContactsModal.addContactTitle')}
            </h2>
            <label className="block mb-2 font-medium text-gray-700">
              {t('patientDashboard.emergencyContactsModal.contactName')}
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                type="text"
                className="mt-1 w-full rounded border border-gray-300 p-2"
                placeholder={t('patientDashboard.emergencyContactsModal.enterName')}
              />
            </label>
            <label className="block mb-4 font-medium text-gray-700">
              {t('patientDashboard.emergencyContactsModal.phoneNumber')}
              <input
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                type="tel"
                className="mt-1 w-full rounded border border-gray-300 p-2"
                placeholder={t('patientDashboard.emergencyContactsModal.enterPhone')}
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                {t('patientDashboard.emergencyContactsModal.cancel')}
              </button>
              <button
                onClick={handleAddContact}
                className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
              >
                {t('patientDashboard.emergencyContactsModal.add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-6 max-w-7xl mx-auto mt-8 pb-12">
        {/* Left Column - Main Dashboard Content */}
        <main className="flex-1 max-w-3xl space-y-6">
          {/* Emergency Labor */}
          <div className="w-full">
            <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-4 rounded-lg shadow">
              <ExclamationTriangleIcon className="h-6 w-6" />
              {t('patientDashboard.emergencyLabor')}
            </button>
          </div>

          {/* Voice Daily Log */}
          <section className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex items-center gap-2 text-pink-700 font-semibold text-lg">
              <MicrophoneIcon className="h-5 w-5" />
              {t('patientDashboard.voiceDailyLog.title')}
            </div>
            <p className="text-sm text-gray-500">{t('patientDashboard.voiceDailyLog.description')}</p>
            <button 
              onClick={onNavigateToVoiceLog}
              className="w-full mt-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <MicrophoneIcon className="h-5 w-5" />
              {t('patientDashboard.voiceDailyLog.startRecording')}
            </button>
          </section>

          {/* My Reminders */}
          <section className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <BellIcon className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold">{t('patientDashboard.myReminders')}</span>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HeartIcon className="h-6 w-6 text-pink-400" />
                  <div>
                    <div className="font-medium text-gray-800">{t('patientDashboard.reminders.ironTablet')}</div>
                    <div className="text-xs text-gray-500">9:00 AM</div>
                  </div>
                </div>
                <span className="px-3 py-0.5 rounded-full text-xs bg-pink-100 text-pink-600 border border-pink-200">
                  {t('patientDashboard.reminders.medication')}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="font-medium text-gray-800">{t('patientDashboard.reminders.doctorVisit')}</div>
                    <div className="text-xs text-gray-500">{t('patientDashboard.reminders.tomorrow')} 2:00 PM</div>
                  </div>
                </div>
                <span className="px-3 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600 border border-blue-200">
                  {t('patientDashboard.reminders.checkup')}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HeartIcon className="h-6 w-6 text-green-400" />
                  <div>
                    <div className="font-medium text-gray-800">{t('patientDashboard.reminders.drinkMilk')}</div>
                    <div className="text-xs text-gray-500">6:00 PM</div>
                  </div>
                </div>
                <span className="px-3 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">
                  {t('patientDashboard.reminders.nutrition')}
                </span>
              </li>
            </ul>
          </section>
        </main>

        {/* Right Column - Nearby ASHA Workers */}
        <aside className="w-80 space-y-6">
          <section className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="h-5 w-5 text-purple-500" />
              <span className="font-semibold text-lg">{t('patientDashboard.nearbyAshaWorkers.title')}</span>
            </div>

            {loadingAshaWorkers && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="ml-2 text-gray-600">{t('patientDashboard.nearbyAshaWorkers.loadingMessage')}</span>
              </div>
            )}

            {ashaWorkersError && (
              <div className="text-center py-8">
                <p className="text-red-600 text-sm">{t('patientDashboard.nearbyAshaWorkers.errorMessage')}</p>
                <p className="text-xs text-gray-500 mt-1">{ashaWorkersError}</p>
              </div>
            )}

            {!loadingAshaWorkers && !ashaWorkersError && nearbyAshaWorkers.length === 0 && (
              <div className="text-center py-8">
                <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">{t('patientDashboard.nearbyAshaWorkers.noWorkersFound')}</p>
              </div>
            )}

            {!loadingAshaWorkers && !ashaWorkersError && nearbyAshaWorkers.length > 0 && (
              <div className="space-y-4">
                {nearbyAshaWorkers.map((worker, index) => (
                  <div key={worker._id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{worker.name}</h4>
                        <p className="text-xs text-gray-500">{worker.ashaId}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {worker.distance ? `${worker.distance.toFixed(1)} km` : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-3">
                      <p>{worker.village}, {worker.district}</p>
                      {worker.experience && (
                        <p>{t('patientDashboard.nearbyAshaWorkers.experience')}: {worker.experience} {t('patientDashboard.nearbyAshaWorkers.years')}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContactAshaWorker(worker)}
                        className="flex-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-medium rounded-md transition-colors"
                      >
                        <PhoneIcon className="h-3 w-3 inline mr-1" />
                        {t('patientDashboard.nearbyAshaWorkers.contact')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>

      {/* Assistant Chatbot */}
      <AssistantHover />
    </div>
  );
}
