import React from "react";
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

const Dashboard = ({ user }) => {
  const adminStats = [
    {
      label: "Total Users",
      value: 1247,
      icon: <UserIcon className="h-8 w-8 text-pink-600 mx-auto" />,
      color: "text-pink-600",
    },
    {
      label: "Active Patients",
      value: 892,
      icon: <UserGroupIcon className="h-8 w-8 text-green-600 mx-auto" />,
      color: "text-green-600",
    },
    {
      label: "ASHA Workers",
      value: 156,
      icon: <IdentificationIcon className="h-8 w-8 text-sky-500 mx-auto" />,
      color: "text-sky-500",
    },
    {
      label: "Pending Reviews",
      value: 23,
      icon: <ClockIcon className="h-8 w-8 text-yellow-500 mx-auto" />,
      color: "text-yellow-500",
    },
  ];

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
        {[
          {
            name: "Meera Devi",
            phone: "9876543213",
            area: "Andheri West",
            submitted: "2024-01-15",
            docs: [
              "government-id.jpg",
              "asha-certificate.pdf",
              "area-assignment.pdf",
            ],
          },
          {
            name: "Lakshmi Kumari",
            phone: "9876543214",
            area: "Borivali East",
            submitted: "2024-01-14",
            docs: ["aadhar-card.jpg", "training-certificate.pdf"],
          },
        ].map((pv, idx) => (
          <div
            key={idx}
            className={
              "px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between" +
              (idx !== 1 ? " border-b border-[#ece1e7]" : "")
            }
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-800 mb-0.5">
                {pv.name}
              </div>
              <div className="text-gray-500 text-[15px] leading-snug">
                Phone: {pv.phone} <br />
                Area: {pv.area} <br />
                Submitted: {pv.submitted}
              </div>
              <div className="mt-2 font-medium text-gray-700">
                Uploaded Documents:
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {pv.docs.map((doc, i) => (
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
            </div>
            <div className="flex flex-col items-stretch mt-4 md:mt-0 md:ml-6 w-full md:w-auto">
              <div className="flex items-center gap-1.5 mb-2 md:justify-end">
                <span className="text-xs font-semibold px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded">
                  Pending
                </span>
              </div>
              <div className="flex flex-row w-full gap-2">
                <button className="flex-1 bg-green-500 text-white rounded px-5 py-2 text-base font-semibold hover:bg-green-600 transition-all">
                  Approve
                </button>
                <button className="flex-1 bg-red-500 text-white rounded px-5 py-2 text-base font-semibold hover:bg-red-600 transition-all">
                  Reject
                </button>
                <button className="flex items-center bg-gray-100 text-gray-700 px-6 py-2 rounded border border-gray-200 hover:bg-gray-200 transition ml-1 whitespace-nowrap">
                  <EyeIcon className="mr-1 h-5 w-5" />
                  Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
