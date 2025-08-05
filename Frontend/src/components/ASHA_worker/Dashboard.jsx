import React from "react";
import Header from "../../navbar/Header";

// Dummy Data
const summaryStats = [
  { label: "Assigned Patients", value: 47, icon: "🤰" },
  { label: "Voice Logs Reviewed", value: 23, icon: "🎤" },
  { label: "Appointments Scheduled", value: 12, icon: "📅" },
  { label: "Emergency Alerts", value: 2, icon: "🚨" }
];

const pendingVerifications = [
  {
    name: "Priya Sharma",
    phone: "9876543213",
    area: "Andheri West",
    submitted: "2024-01-15",
    status: "Needs Review",
    concern: "High blood pressure reading",
    urgency: "Medium"
  },
  {
    name: "Sunita Devi",
    phone: "9876543214",
    area: "Borivali East",
    submitted: "2024-01-14",
    status: "Urgent",
    concern: "Severe morning sickness",
    urgency: "High"
  }
];

const analytics = {
  dailyActivePatients: "~25",
  voiceLogsReviewed: 47,
  appointmentsScheduled: 12,
  averageResponseTime: "2.5 hours",
  patientSatisfaction: "94%",
  casesResolved: "89%"
};

// Utility for priority badge styling
const getPriorityStyle = (urgency) => {
  if (urgency === "High") {
    return { background: "#ffebee", color: "#c62828" };
  }
  return { background: "#fff3e0", color: "#e65100" };
};

const Dashboard = ({ user }) => {

  // Placeholder handlers
  const handleContact = name => alert(`Contacting ${name}!`);
  const handleSchedule = name => alert(`Scheduling appointment for ${name}!`);
  const handleNotes = name => alert(`Viewing notes for ${name}!`);
  
  const handleLogout = () => {
    window.location.reload(); // Simple logout - reload to go back to landing
  };

  return (
    <div className="dashboard-container" style={{ fontFamily: "sans-serif" }}>
      <Header 
        title="ASHA Worker Dashboard" 
        userName={user?.name || "Meera Devi"}
        onLogout={handleLogout}
      />

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
            <div style={{ fontWeight: 700, fontSize: 25, color: "#e53986" }}>{stat.value}</div>
            <div style={{ color: "#8a94a6", fontSize: 16 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pending verifications */}
      <section className="pending-verifications-section" style={{ marginBottom: 28 }}>
        <h3 style={{ color: "#e53986", marginBottom: 0 }}>Patient Cases Requiring Attention</h3>
        <div style={{ color: "#525252", fontSize: 14, marginBottom: 17 }}>Review and respond to patient concerns</div>
        {pendingVerifications.map((item, idx) => (
          <div key={idx} className="pending-item" style={{ background: "#fff", borderRadius: 9, marginBottom: 18, padding: 20, boxShadow: "0 1px 2px #0001" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: 17 }}>{item.name}</div>
                <div style={{ color: "#595959", fontSize: 14 }}>Phone: {item.phone}</div>
                <div style={{ color: "#595959", fontSize: 14 }}>Area: {item.area}</div>
                <div style={{ color: "#595959", fontSize: 14 }}>Reported: {item.submitted}</div>
                <div style={{ color: "#7c7c7c", fontSize: 14, margin: "2px 0" }}>
                  Status: <span style={{ color: item.urgency === "High" ? "#f04141" : "#e53986" }}>{item.status}</span>
                </div>
                <div style={{ marginTop: "8px" }}>
                  <b>Concern:</b> {item.concern}
                </div>
                <div style={{ 
                  marginTop: "5px", 
                  padding: "3px 8px", 
                  borderRadius: "12px", 
                  display: "inline-block",
                  fontSize: "12px",
                  background: item.urgency === "High" ? "#ffebee" : "#fff3e0",
                  color: item.urgency === "High" ? "#c62828" : "#e65100"
                }}>
                  {item.urgency} Priority
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div>
                  <button
                    style={{
                      background: "#e53986",
                      color: "#fff",
                      padding: "9px 32px",
                      marginRight: 10,
                      border: "none",
                      fontWeight: "bold",
                      borderRadius: 6,
                      fontSize: 15,
                      cursor: "pointer"
                    }}
                    onClick={() => handleContact(item.name)}
                  >
                    Contact
                  </button>
                  <button
                    style={{
                      background: "#28a745",
                      color: "#fff",
                      padding: "9px 32px",
                      border: "none",
                      fontWeight: "bold",
                      borderRadius: 6,
                      fontSize: 15,
                      cursor: "pointer",
                      marginRight: 10
                    }}
                    onClick={() => handleSchedule(item.name)}
                  >
                    Schedule
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
                    onClick={() => handleNotes(item.name)}
                  >
                    Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Analytics */}
      <section className="analytics-section" style={{ marginBottom: 28 }}>
        <h3 style={{ color: "#e53986" }}>My Performance</h3>
        <div className="analytics-overview" style={{ display: "flex", justifyContent: "space-between", gap: 80, fontSize: 15 }}>
          <div>
            <b>Patient Care (This Month)</b>
            <div>Daily Active Patients: {analytics.dailyActivePatients}</div>
            <div>Voice Logs Reviewed: {analytics.voiceLogsReviewed}</div>
            <div>Appointments Scheduled: {analytics.appointmentsScheduled}</div>
          </div>
          <div>
            <b>Performance Metrics</b>
            <div>Average Response Time: <span style={{ color: "#e53986" }}>{analytics.averageResponseTime}</span></div>
            <div>Patient Satisfaction: <span style={{ color: "#e53986" }}>{analytics.patientSatisfaction}</span></div>
            <div>Cases Resolved: <span style={{ color: "#e53986" }}>{analytics.casesResolved}</span></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
