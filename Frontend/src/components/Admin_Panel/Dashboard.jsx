import React, { useState, useEffect } from "react";
import Header from "../../navbar/Header";
import {
  UserIcon,
  UserGroupIcon,
  IdentificationIcon,
  ClockIcon,
  PencilSquareIcon,
  EyeIcon,
  CheckIcon,
  BellAlertIcon,
  DocumentIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  getTotalUserCount,
  getPendingAshaWorkersCount,
  getVerifiedAshaWorkersCount,
  getPendingVerifications,
  updateVerificationStatus,
  showAshaDocuments,
} from "../../services/adminAPI";

const Dashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminStats, setAdminStats] = useState([
    {
      label: "Total Users",
      value: 0,
      icon: <UserIcon className="h-8 w-8 text-pink-600 mx-auto" />,
      color: "text-pink-600",
    },
    {
      label: "Active Patients",
      value: 0,
      icon: <UserGroupIcon className="h-8 w-8 text-green-600 mx-auto" />,
      color: "text-green-600",
    },
    {
      label: "Verified ASHA Workers",
      value: 0,
      icon: <IdentificationIcon className="h-8 w-8 text-sky-500 mx-auto" />,
      color: "text-sky-500",
    },
    {
      label: "Pending Reviews",
      value: 0,
      icon: <ClockIcon className="h-8 w-8 text-yellow-500 mx-auto" />,
      color: "text-yellow-500",
    },
  ]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch all data when component mounts
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all counts and data in parallel
      const [
        totalUsersData,
        pendingCountData,
        verifiedCountData,
        pendingVerificationsData,
      ] = await Promise.all([
        getTotalUserCount(),
        getPendingAshaWorkersCount(),
        getVerifiedAshaWorkersCount(),
        getPendingVerifications(),
      ]);

      // Update stats with real data
      setAdminStats([
        {
          label: "Total Users",
          value: totalUsersData.totalUsers || 0,
          icon: <UserIcon className="h-8 w-8 text-pink-600 mx-auto" />,
          color: "text-pink-600",
        },
        {
          label: "Active Patients",
          value: totalUsersData.totalUsers || 0, // You can modify this if you have separate patient count
          icon: <UserGroupIcon className="h-8 w-8 text-green-600 mx-auto" />,
          color: "text-green-600",
        },
        {
          label: "Verified ASHA Workers",
          value: verifiedCountData.totalVerified || 0,
          icon: <IdentificationIcon className="h-8 w-8 text-sky-500 mx-auto" />,
          color: "text-sky-500",
        },
        {
          label: "Pending Reviews",
          value: pendingCountData.totalPending || 0,
          icon: <ClockIcon className="h-8 w-8 text-yellow-500 mx-auto" />,
          color: "text-yellow-500",
        },
      ]);

      // Set pending verifications data
      setPendingVerifications(pendingVerificationsData.data || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async (ashaId, status) => {
    setActionLoading(prev => ({ ...prev, [ashaId]: status }));
    try {
      await updateVerificationStatus(ashaId, status);
      // Refresh data after successful update
      await fetchAllData();
      console.log(`Successfully ${status} ASHA worker with ID: ${ashaId}`);
    } catch (err) {
      console.error(`Error ${status} verification:`, err);
      setError(`Failed to ${status} verification. Please try again.`);
    } finally {
      setActionLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[ashaId];
        return newLoading;
      });
    }
  };

  const handleReviewDocuments = async (ashaId) => {
    setActionLoading(prev => ({ ...prev, [`${ashaId}_review`]: true }));
    try {
      const response = await showAshaDocuments(ashaId);
      console.log('Documents data:', response);
      // You can add logic here to display the documents in a modal or navigate to a new page
      // For now, we'll just log the response
      alert(`Documents fetched successfully for ASHA ID: ${ashaId}`);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to fetch documents. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[`${ashaId}_review`];
        return newLoading;
      });
    }
  };

  const recentActivities = [
    {
      time: "10:30 AM",
      action: "New patient registered",
      user: "Priya Sharma",
      type: "registration",
    },
    {
      time: "09:45 AM",
      action: "Voice log reviewed",
      user: "Dr. Kumar",
      type: "review",
    },
    {
      time: "09:15 AM",
      action: "ASHA worker verified",
      user: "Meera Devi",
      type: "verification",
    },
    {
      time: "08:30 AM",
      action: "Emergency alert resolved",
      user: "Lakshmi Singh",
      type: "emergency",
    },
  ];

  const systemHealth = {
    serverStatus: "Online",
    lastBackup: "2024-01-20 02:00 AM",
    activeConnections: 342,
    dataUsage: "2.3 TB",
    uptime: "99.9%",
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "registration":
        return <PencilSquareIcon className="h-6 w-6 mr-1 text-gray-500" />;
      case "review":
        return <EyeIcon className="h-6 w-6 mr-1 text-gray-500" />;
      case "verification":
        return <CheckIcon className="h-6 w-6 mr-1 text-green-600" />;
      case "emergency":
        return <BellAlertIcon className="h-6 w-6 mr-1 text-red-500" />;
      default:
        return <PencilSquareIcon className="h-6 w-6 mr-1 text-gray-500" />;
    }
  };

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <div className="admin-dashboard min-h-screen bg-[#faf7fa] px-4 md:px-10 py-8 font-sans">
      <Header
        title="Admin Dashboard"
        userName={user?.name || "Administrator"}
        onLogout={handleLogout}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading Spinner for initial load */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 mt-6">
            {adminStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-7 rounded-xl text-center shadow-sm border border-[#f0f0f0]"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`${stat.color} text-2xl font-bold mb-1`}>
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow mb-8 border border-[#f3eaf1] max-w-5xl mx-auto">
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center mb-1">
                <ClockIcon className="text-yellow-500 h-6 w-6 mr-2" />
                <span className="text-lg font-semibold text-gray-700">
                  Pending Verifications
                </span>
              </div>
              <div className="text-gray-500 text-[15px] mb-5">
                Review and approve ASHA worker applications
              </div>
            </div>
            {pendingVerifications.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No pending verifications at this time.
              </div>
            ) : (
              pendingVerifications.map((pv, idx) => (
                <div
                  key={pv.ashaId || idx}
                  className={
                    "px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between" +
                    (idx !== pendingVerifications.length - 1 ? " border-b border-[#ece1e7]" : "")
                  }
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-0.5">
                      {pv.name}
                    </div>
                    <div className="text-gray-500 text-[15px] leading-snug">
                      Phone: {pv.phoneNumber} <br />
                      ASHA ID: {pv.ashaId} <br />
                      Area: {pv.village}, {pv.district}, {pv.state}
                    </div>
                    {pv.documents && pv.documents.length > 0 && (
                      <>
                        <div className="mt-2 font-medium text-gray-700">
                          Uploaded Documents:
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {pv.documents.map((doc, i) => (
                            <div
                              key={i}
                              className="flex items-center px-3 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700 select-none"
                            >
                              {doc.endsWith(".pdf") ? (
                                <DocumentIcon className="h-5 w-5 mr-1 text-indigo-500" />
                              ) : (
                                <PhotoIcon className="h-5 w-5 mr-1 text-pink-400" />
                              )}
                              {doc}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-stretch mt-4 md:mt-0 md:ml-6 w-full md:w-auto">
                    <div className="flex items-center gap-1.5 mb-2 md:justify-end">
                      <span className="text-xs font-semibold px-3 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded">
                        Pending
                      </span>
                    </div>
                    <div className="flex flex-row w-full gap-2">
                      <button 
                        onClick={() => handleVerificationAction(pv.ashaId, 'approved')}
                        disabled={actionLoading[pv.ashaId]}
                        className="flex-1 bg-green-500 text-white rounded px-5 py-2 text-base font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[pv.ashaId] === 'approved' ? 'Processing...' : 'Approve'}
                      </button>
                      <button 
                        onClick={() => handleVerificationAction(pv.ashaId, 'rejected')}
                        disabled={actionLoading[pv.ashaId]}
                        className="flex-1 bg-red-500 text-white rounded px-5 py-2 text-base font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[pv.ashaId] === 'rejected' ? 'Processing...' : 'Reject'}
                      </button>
                      <button 
                        onClick={() => handleReviewDocuments(pv.ashaId)}
                        disabled={actionLoading[`${pv.ashaId}_review`]}
                        className="flex items-center bg-gray-100 text-gray-700 px-6 py-2 rounded border border-gray-200 hover:bg-gray-200 transition ml-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <EyeIcon className="mr-1 h-5 w-5" />
                        {actionLoading[`${pv.ashaId}_review`] ? 'Loading...' : 'Review'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div className="bg-white rounded-lg shadow border border-[#f3eaf1] px-7 py-6 max-w-5xl mx-auto mt-8">
        <div className="flex items-center mb-1">
          <PencilSquareIcon className="text-pink-600 mr-2 h-6 w-6" />
          <span className="text-lg font-bold text-gray-700">Analytics</span>
        </div>
        <span className="text-gray-500 text-sm block mb-2">
          System overview and health metrics
        </span>
        <div className="flex flex-col md:flex-row gap-8 mt-1">
          <div className="flex-1">
            <div className="font-bold text-gray-700 mb-1">
              User Activity (Last 30 Days)
            </div>
            <div className="ml-1 text-gray-600 space-y-0.5 text-base">
              <div>
                <span>Daily Active Users: </span>
                <span className="font-semibold">~450</span>
              </div>
              <div>
                <span>Voice Logs Recorded: </span>
                <span className="font-semibold">2,847</span>
              </div>
              <div>
                <span>Emergency Alerts: </span>
                <span className="font-semibold">12</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-700 mb-1">System Health</div>
            <div className="ml-1 text-gray-600 space-y-0.5 text-base">
              <div>
                <span>Server Uptime: </span>
                <span className="font-bold text-green-500">99.9%</span>
              </div>
              <div>
                <span>Data Sync Success Rate: </span>
                <span className="font-bold text-green-500">98.7%</span>
              </div>
              <div>
                <span>Average Response Time: </span>
                <span className="font-bold text-green-500">145ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
