import React from "react";

const Dashboard = () => {
  // Example static data
  const adminName = "Dr. Rajesh Kumar";
  const summaryStats = [
    { label: "Total Users", value: 1247, icon: "👤" },
    { label: "Active Patients", value: 892, icon: "🛡️" },
    { label: "Verified ASHA", value: 156, icon: "✔️" },
    { label: "Pending Verifications", value: 1, icon: "⏰" },
  ];

  const pendingVerification = {
    name: "Lakshmi Kumari",
    phone: "9876543214",
    area: "Borivali East",
    submitted: "2024-01-14",
    status: "Pending",
    documents: [
      { name: "aadhar-card.jpg", type: "image" },
      { name: "training-certificate.pdf", type: "pdf" },
    ],
  };

  const analytics = {
    dailyActiveUsers: "~450",
    voiceLogs: 2_847,
    emergencyAlerts: 12,
    serverUptime: "99.9%",
    dataSyncRate: "98.7%",
    avgResponseTime: "145ms",
  };

  // Button handlers for approve/reject could be connected with real APIs.
  const handleApprove = () => {
    alert("Approved!");
  };

  const handleReject = () => {
    alert("Rejected!");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <span>{adminName}</span>
        <button className="logout-btn">Logout</button>
      </header>

      {/* Top Summary Cards */}
      <div className="dashboard-cards-row">
        {summaryStats.map((stat, idx) => (
          <div key={idx} className="dashboard-card">
            <span className="dashboard-card-icon">{stat.icon}</span>
            <div className="dashboard-card-value">{stat.value}</div>
            <div className="dashboard-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Verifications */}
      <section className="pending-verifications-section">
        <h3>Pending Verifications</h3>
        <p>Review and approve ASHA worker applications</p>
        <div className="pending-app-card">
          <div className="pending-app-details">
            <strong>{pendingVerification.name}</strong>
            <div>Phone: {pendingVerification.phone}</div>
            <div>Area: {pendingVerification.area}</div>
            <div>Submitted: {pendingVerification.submitted}</div>
            <div>Status: <span className="status-pending">{pendingVerification.status}</span></div>
            <div>
              <b>Uploaded Documents:</b>&nbsp;
              {pendingVerification.documents.map((doc, i) => (
                <button
                  key={i}
                  className="doc-btn"
                  onClick={() => alert(`Open ${doc.name}`)}
                  style={{ marginRight: 8 }}
                  title={doc.name}
                >
                  {doc.type === "image" ? "🖼️" : "📄"} {doc.name}
                </button>
              ))}
            </div>
          </div>
          <div className="pending-app-actions">
            <button className="approve-btn" onClick={handleApprove}>
              Approve
            </button>
            <button className="reject-btn" onClick={handleReject}>
              Reject
            </button>
            <button className="review-btn">
              Review
            </button>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="analytics-section">
        <h3>Analytics</h3>
        <div className="analytics-overview">
          <div className="analytics-user-activity">
            <b>User Activity (Last 30 Days)</b>
            <div>Daily Active Users: {analytics.dailyActiveUsers}</div>
            <div>Voice Logs Recorded: {analytics.voiceLogs}</div>
            <div>Emergency Alerts: {analytics.emergencyAlerts}</div>
          </div>
          <div className="analytics-system-health">
            <b>System Health</b>
            <div>Server Uptime: <span className="success">{analytics.serverUptime}</span></div>
            <div>Data Sync Success Rate: <span className="success">{analytics.dataSyncRate}</span></div>
            <div>Average Response Time: <span className="success">{analytics.avgResponseTime}</span></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
