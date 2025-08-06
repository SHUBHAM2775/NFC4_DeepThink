import React, { useEffect, useState } from "react";
import Header from "../../navbar/Header";
import ASHAPastVoiceLogs from "../ASHAPastVoiceLogs";
import {
  UserGroupIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  UserCircleIcon,
  DocumentTextIcon,
  PhoneIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import {
  getHighRiskPatientsCount,
  getAshaWorkerName,
  getAshaWorkerVerificationStatus,
  getAshaWorkerStats,
  getAshaWorkerPatients
} from "../../services/ashaWorkerAPI";

const Dashboard = ({ user }) => {
  // State for API data
  const [summaryStats, setSummaryStats] = useState([
    { label: "Assigned Patients", value: "...", icon: UserGroupIcon, loading: true },
    { label: "High Risk", value: "...", icon: FlagIcon, loading: true },
    { label: "Missed Logs", value: "...", icon: ExclamationTriangleIcon, loading: true },
    { label: "Compliance", value: "...", icon: CheckBadgeIcon, loading: true }
  ]);
  
  const [patients, setPatients] = useState([]);
  const [ashaWorkerName, setAshaWorkerName] = useState(user?.name || 'ASHA Worker');
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [hasAlerted, setHasAlerted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPastLogs, setShowPastLogs] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Extract ASHA ID from user data (demo mode fallback)
  const getAshaId = () => {
    if (user?.refId && user.refId !== "demo_ref_" + user.refId) {
      return user.refId;
    }
    // Demo mode - use a default ASHA ID or extract from user data
    return "ASHA001"; // Default for demo
  };

  // Fetch ASHA worker data
  useEffect(() => {
    const fetchAshaWorkerData = async () => {
      try {
        setLoading(true);
        const ashaId = getAshaId();

        // Fetch all data in parallel
        const [
          nameData,
          verificationData,
          highRiskCountData,
          statsData,
          patientsData
        ] = await Promise.allSettled([
          getAshaWorkerName(ashaId),
          getAshaWorkerVerificationStatus(ashaId),
          getHighRiskPatientsCount(),
          getAshaWorkerStats(ashaId),
          getAshaWorkerPatients(ashaId)
        ]);

        // Handle name data
        if (nameData.status === 'fulfilled') {
          setAshaWorkerName(nameData.value.name);
        }

        // Handle verification status
        if (verificationData.status === 'fulfilled') {
          setVerificationStatus(verificationData.value.verificationStatus);
        }

        // Handle statistics with fallback data
        let highRiskCount = 0;
        if (highRiskCountData.status === 'fulfilled') {
          highRiskCount = highRiskCountData.value.count;
        }

        let stats = {
          assignedPatients: 3,
          missedLogs: 4,
          compliance: "85%"
        };
        if (statsData.status === 'fulfilled') {
          stats = statsData.value;
        }

        // Update summary stats
        setSummaryStats([
          { label: "Assigned Patients", value: stats.assignedPatients, icon: UserGroupIcon, loading: false },
          { label: "High Risk", value: highRiskCount, icon: FlagIcon, loading: false },
          { label: "Missed Logs", value: stats.missedLogs, icon: ExclamationTriangleIcon, loading: false },
          { label: "Compliance", value: stats.compliance, icon: CheckBadgeIcon, loading: false }
        ]);

        // Handle patients data with fallback
        let patientsArray = initialPatients; // Fallback to static data
        if (patientsData.status === 'fulfilled' && patientsData.value.length > 0) {
          patientsArray = patientsData.value.map(patient => ({
            ...patient,
            animation: patient.risk === 'high'
          }));
        }
        setPatients(patientsArray);

      } catch (err) {
        console.error('Error fetching ASHA worker data:', err);
        setError('Failed to load data. Using demo data.');
        
        // Use fallback data
        setSummaryStats([
          { label: "Assigned Patients", value: 3, icon: UserGroupIcon, loading: false },
          { label: "High Risk", value: 2, icon: FlagIcon, loading: false },
          { label: "Missed Logs", value: 4, icon: ExclamationTriangleIcon, loading: false },
          { label: "Compliance", value: "85%", icon: CheckBadgeIcon, loading: false }
        ]);
        setPatients(initialPatients);
      } finally {
        setLoading(false);
      }
    };

    fetchAshaWorkerData();
  }, [user]);

  // Static fallback data for demo purposes
  const initialPatients = [
    {
      name: "Priya Sharma",
      phoneNumber: "8669212403",
      due: "2024-03-15",
      lastLog: "2 days ago",
      risk: "high",
      compliance: 60,
      missed: 3,
      animation: true
    },
    {
      name: "Anita Patel",
      phoneNumber: "9876543211",
      due: "2024-04-20",
      lastLog: "1 day ago",
      risk: "medium",
      compliance: 80,
      missed: 1,
      animation: true
    },
    {
      name: "Kavya Singh",
      phoneNumber: "9876543212",
      due: "2024-05-10",
      lastLog: "Today",
      risk: "low",
      compliance: 95,
      missed: 0,
      animation: true
    }
  ];

  // Style mappings
  const riskMap = {
    high: "bg-red-100 text-red-700",
    medium: "bg-blue-100 text-blue-700",
    low: "bg-green-100 text-green-700"
  };

  const missedLogColor = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-gray-500"
  };

  // Alert for high risk patients
  useEffect(() => {
    if (!hasAlerted && !loading && patients.length > 0) {
      patients.forEach(p => {
        if (p.risk === "high") {
          alert(`🚨 URGENT: ${p.name} is HIGH RISK!\nPlease call her immediately.`);
          speak(`Alert. ${p.name} is in high risk. Please call her now.`);
        }
      });
      setHasAlerted(true);
    }
  }, [hasAlerted, patients, loading]);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = "en-IN";
      speechSynthesis.speak(msg);
    }
  };

  const handleContact = (name, phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
    setPatients(prev =>
      prev.map(p =>
        p.name === name ? { ...p, animation: false } : p
      )
    );
  };

  const handleNotes = name => alert(`Viewing notes for ${name}!`);

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-3px); }
          40%, 60% { transform: translateX(3px); }
        }
        .animate-shake {
          animation: shake 1s ease-in-out infinite;
        }

        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.5); }
          70% { box-shadow: 0 0 0 10px rgba(198, 40, 40, 0); }
          100% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0); }
        }
        .animate-pulse-border {
          animation: pulse-border 2s infinite;
        }
      `}</style>

      <Header
        user={{ ...user, name: ashaWorkerName }}
        onLogout={handleLogout}
      />

      {/* Error Banner */}
      {error && (
        <div className="max-w-6xl mx-auto mt-4 px-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      )}

      {/* Dashboard content */}
      {!loading && (
        <>
          {/* Summary Statistics */}
          <div className="flex flex-wrap justify-center gap-6 py-6 max-w-6xl mx-auto">
            {summaryStats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-5 w-52 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2" color={idx === 2 ? "#ffc857" : idx === 3 ? "#37b86c" : "#e53986"} />
                <div className={`text-xl font-bold ${idx === 3 ? "text-green-600" : "text-pink-600"}`}>
                  {stat.loading ? (
                    <div className="animate-pulse bg-gray-200 h-6 w-8 mx-auto rounded"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                
                {/* Verification status indicator for ASHA worker */}
                {idx === 0 && verificationStatus && (
                  <div className={`mt-2 text-xs px-2 py-1 rounded-full ${
                    verificationStatus === 'verified' 
                      ? 'bg-green-100 text-green-700' 
                      : verificationStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {verificationStatus === 'verified' ? '✓ Verified' : 
                     verificationStatus === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Patients List */}
          <div className="bg-white rounded-xl shadow max-w-6xl mx-auto p-6">
            <h3 className="text-pink-600 text-xl font-semibold mb-4 flex items-center">
              <UserCircleIcon className="w-5 h-5 mr-2" />
              My Patients {patients.length > 0 && `(${patients.length})`}
            </h3>

            {patients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserCircleIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No patients assigned yet.</p>
              </div>
            ) : (
              patients.map((p, i) => {
                const isHighRisk = p.risk === 'high';
                return (
                  <div
                    key={p.name || i}
                    className={`rounded-lg p-4 mb-5 border relative transition-shadow duration-300 ${
                      isHighRisk
                        ? `border-red-700 shadow-lg ${
                            p.animation ? "animate-pulse-border" : ""
                          }`
                        : "border-pink-100 shadow"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="font-bold text-base text-gray-900">{p.name}</span>
                      <span className={`ml-3 text-sm font-medium px-3 py-1 rounded-full capitalize ${riskMap[p.risk]}`}>
                        {p.risk} risk
                      </span>
                      {p.missed > 0 && (
                        <span className={`ml-3 text-sm font-semibold ${missedLogColor[p.risk]}`}>
                          {p.missed} missed logs
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Due: {p.due} &nbsp;&nbsp; | &nbsp;&nbsp; Last log: {p.lastLog}
                    </div>

                    <div className="text-sm font-semibold text-gray-500 mt-3 mb-1">Compliance Score</div>
                    <div className="w-full max-w-md h-4 bg-pink-100 rounded overflow-hidden relative">
                      <div
                        className="bg-pink-600 h-full rounded-l"
                        style={{ width: `${p.compliance}%` }}
                      ></div>
                      <div className="absolute right-3 top-[2px] text-xs font-semibold">
                        {p.compliance}%
                      </div>
                    </div>

                    <div className="flex items-center mt-4 space-x-3">
                      <button
                        onClick={() => handleNotes(p.name)}
                        className="bg-gray-100 hover:bg-gray-200 text-sm font-medium px-4 py-2 rounded flex items-center"
                      >
                        <DocumentTextIcon className="w-4 h-4 mr-2 text-gray-500" />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPatient({ id: p._id || 'demo_patient_' + i, name: p.name });
                          setShowPastLogs(true);
                        }}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium px-4 py-2 rounded flex items-center"
                      >
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Past Logs
                      </button>
                      <button
                        onClick={() => handleContact(p.name, p.phoneNumber)}
                        className={`ml-auto px-5 py-2 text-sm font-bold rounded flex items-center border transition-all duration-300 ${
                          isHighRisk
                            ? `bg-red-700 text-white border-red-700 ${p.animation ? "animate-shake" : ""}`
                            : "text-pink-600 border-pink-600 hover:bg-pink-50"
                        }`}
                      >
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        Call
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Past Voice Logs Modal */}
      {showPastLogs && selectedPatient && (
        <ASHAPastVoiceLogs 
          patientId={selectedPatient.id} 
          patientName={selectedPatient.name}
          onClose={() => {
            setShowPastLogs(false);
            setSelectedPatient(null);
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;
