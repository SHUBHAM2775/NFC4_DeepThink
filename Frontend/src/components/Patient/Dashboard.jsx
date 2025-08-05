import React, { useState, useEffect } from "react";
import {
  BellIcon,
  MicrophoneIcon,
  CalendarIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function PatientDashboard() {
  const defaultContacts = [
  { id: 1, label: "ASHA Worker: Sunita Devi", number: "+91 98765 43210" },
  { id: 2, label: "Nearest Hospital", number: "+91 12345 67890" },
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

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
  }, [contacts]);

  // Add new contact handler
  function handleAddContact() {
    if (!newName.trim()) {
      alert("Please enter a contact name.");
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header with Emergency Contacts Dropdown and Logout */}
      <div className="relative bg-white shadow px-8 py-4 flex items-center justify-between">
        {/* Title and User */}
        <div>
          <h1 className="text-2xl font-bold text-pink-700">
            Welcome to Your Health Journey
          </h1>
          <p className="text-sm text-gray-600">Priya Sharma</p>
        </div>

        {/* Right Controls: Emergency Contacts + Logout */}
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
              <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                {contacts.length === 0 && (
                  <p className="text-gray-500">No emergency contacts.</p>
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
                  + Add Contact
                </button>
              </div>
            )}
          </div>

          {/* Logout */}
          <button className="text-gray-600 hover:text-pink-600">Logout</button>
        </div>
      </div>

      {/* Add Contact Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-20 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-pink-700 mb-4">
              Add Emergency Contact
            </h2>
            <label className="block mb-2 font-medium text-gray-700">
              Contact Name
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                type="text"
                className="mt-1 w-full rounded border border-gray-300 p-2"
                placeholder="Enter name"
              />
            </label>
            <label className="block mb-4 font-medium text-gray-700">
              Phone Number (optional)
              <input
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                type="tel"
                className="mt-1 w-full rounded border border-gray-300 p-2"
                placeholder="Enter phone number"
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
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
