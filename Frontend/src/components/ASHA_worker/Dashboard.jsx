import React from "react";

// Dummy Data
const summaryStats = [
  { label: "Total Users", value: 1247, icon: "👤" },
  { label: "Active Patients", value: 892, icon: "🛡️" },
  { label: "Verified ASHA", value: 156, icon: "✔️" },
  { label: "Pending Verifications", value: 2, icon: "⏰" }
];

const pendingVerifications = [
  {
    name: "Meera Devi",
    phone: "9876543213",
    area: "Andheri West",
    submitted: "2024-01-15",
    status: "Pending",
    documents: [
      { name: "government-id.jpg", type: "image" },
      { name: "asha-certificate.pdf", type: "pdf" },
      { name: "area-assignment.pdf", type: "pdf" }
    ]
  },
  {
    name: "Lakshmi Kumari",
    phone: "9876543214",
    area: "Borivali East",
    submitted: "2024-01-14",
    status: "Pending",
    documents: [
      { name: "aadhar-card.jpg", type: "image" },
      { name: "training-certificate.pdf", type: "pdf" }
    ]
  }
];

const analytics = {
  dailyActiveUsers: "~450",
  voiceLogs: 2_847,
  emergencyAlerts: 12,
  serverUptime: "99.9%",
  dataSyncRate: "98.7%",
  avgResponseTime: "145ms"
};

// Utility for icons (you can swap these for imported SVG or react-icons)
const getDocIcon = type => (type === "image" ? "🖼️" : "📄");

const Dashboard = () => {

  // Placeholder handlers
  const handleApprove = name => alert(`Approved ${name}!`);
  const handleReject = name => alert(`Rejected ${name}!`);
  const handleReview = name => alert(`Reviewing ${name}!`);
  const handleDocClick = (docName) => alert(`Viewing ${docName}`);

  return (
    <div className="dashboard-container" style={{ fontFamily: "sans-serif" }}>
      {/* Header */}
      <header className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
        <div>
          <h2 style={{ color: "#d12b7c", marginBottom: 0 }}>Admin Dashboard</h2>
          <div style={{ fontSize: 14, color: "#7a7a7a" }}>Dr. Rajesh Kumar</div>
        </div>
        <button className="logout-btn" style={{ background: "none", border: "none", fontWeight: "bold", cursor: "pointer" }}>Logout</button>
      </header>

      {/* Stats cards */}
      <div className="dashboard-cards-row" style={{ display: "flex", gap: 20, marginBottom: 28 }}>
        {summaryStats.map((stat, idx) => (
          <div key={idx}
            style={{
              flex: 1,
              background: "#faf6fa",
              borderRadius: 10,
              boxShadow: "0 1px 2px #0001",
              padding: 22,
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: 32 }}>{stat.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 25, color: "#d02c7e" }}>{stat.value}</div>
            <div style={{ color: "#8a94a6", fontSize: 16 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pending verifications */}
      <section className="pending-verifications-section" style={{ marginBottom: 28 }}>
        <h3 style={{ color: "#e7b505", marginBottom: 0 }}>Pending Verifications</h3>
        <div style={{ color: "#525252", fontSize: 14, marginBottom: 17 }}>Review and approve ASHA worker applications</div>
        {pendingVerifications.map((item, idx) => (
          <div key={idx} className="pending-item" style={{ background: "#fff", borderRadius: 9, marginBottom: 18, padding: 20, boxShadow: "0 1px 2px #0001" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: 17 }}>{item.name}</div>
                <div style={{ color: "#595959", fontSize: 14 }}>Phone: {item.phone}</div>
                <div style={{ color: "#595959", fontSize: 14 }}>Area: {item.area}</div>
                <div style={{ color: "#595959", fontSize: 14 }}>Submitted: {item.submitted}</div>
                <div style={{ color: "#7c7c7c", fontSize: 14, margin: "2px 0" }}>
                  Status: <span style={{ color: "#ffb400" }}>{item.status}</span>
                </div>
                <div>
                  <b>Uploaded Documents:</b>
                  {item.documents.map((doc, i) => (
                    <button
                      type="button"
                      key={i}
                      className="doc-btn"
                      onClick={() => handleDocClick(doc.name)}
                      style={{
                        margin: "5px 8px 5px 0",
                        padding: "5px 10px",
                        fontSize: 14,
                        borderRadius: 6,
                        background: "#f6f6f6",
                        border: "1px solid #eee",
                        cursor: "pointer"
                      }}
                      title={doc.name}
                    >
                      {getDocIcon(doc.type)} {doc.name}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div>
                  <button
                    style={{
                      background: "#34cc73",
                      color: "#fff",
                      padding: "9px 32px",
                      marginRight: 10,
                      border: "none",
                      fontWeight: "bold",
                      borderRadius: 6,
                      fontSize: 15,
                      cursor: "pointer"
                    }}
                    onClick={() => handleApprove(item.name)}
                  >
                    Approve
                  </button>
                  <button
                    style={{
                      background: "#f04141",
                      color: "#fff",
                      padding: "9px 32px",
                      border: "none",
                      fontWeight: "bold",
                      borderRadius: 6,
                      fontSize: 15,
                      cursor: "pointer",
                      marginRight: 10
                    }}
                    onClick={() => handleReject(item.name)}
                  >
                    Reject
                  </button>
                  <button
                    style={{
                      background: "#fff",
                      color: "#505050",
                      padding: "9px 15px",
                      border: "1px solid #dadada",
                      borderRadius: 6,
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                    onClick={() => handleReview(item.name)}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Analytics */}
      <section className="analytics-section" style={{ marginBottom: 28 }}>
        <h3 style={{ color: "#d12b7c" }}>Analytics</h3>
        <div className="analytics-overview" style={{ display: "flex", justifyContent: "space-between", gap: 80, fontSize: 15 }}>
          <div>
            <b>User Activity (Last 30 Days)</b>
            <div>Daily Active Users: {analytics.dailyActiveUsers}</div>
            <div>Voice Logs Recorded: {analytics.voiceLogs}</div>
            <div>Emergency Alerts: {analytics.emergencyAlerts}</div>
          </div>
          <div>
            <b>System Health</b>
            <div>Server Uptime: <span style={{ color: "#34cc73" }}>{analytics.serverUptime}</span></div>
            <div>Data Sync Success Rate: <span style={{ color: "#34cc73" }}>{analytics.dataSyncRate}</span></div>
            <div>Average Response Time: <span style={{ color: "#34cc73" }}>{analytics.avgResponseTime}</span></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
