import React from "react";
import Header from "../../navbar/Header";

const Dashboard = ({ user }) => {
  const patientData = {
    name: "Priya Sharma",
    pregnancyWeek: 28,
    nextAppointment: "2024-01-25",
    vitals: {
      bloodPressure: "120/80",
      weight: "65 kg",
      heartRate: "78 bpm"
    }
  };

  const recentLogs = [
    { date: "2024-01-20", type: "Voice Note", status: "Reviewed", concern: "Mild nausea" },
    { date: "2024-01-18", type: "Checkup", status: "Completed", concern: "Routine visit" },
    { date: "2024-01-15", type: "Voice Note", status: "Pending", concern: "Back pain" }
  ];

  const upcomingTasks = [
    "Take iron supplements",
    "Drink 8 glasses of water daily",
    "Light exercise - 30 minutes",
    "Prenatal vitamins"
  ];

  const handleLogout = () => {
    window.location.reload(); // Simple logout - reload to go back to landing
  };

  return (
    <div className="patient-dashboard" style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <Header 
        title="Patient Dashboard" 
        userName={user?.name || patientData.name}
        onLogout={handleLogout}
      >
        <button style={{ 
          background: "#e53986", 
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Profile Settings
        </button>
      </Header>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ background: "#faf6fa", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#e53986" }}>{patientData.pregnancyWeek}</div>
          <div style={{ color: "#666" }}>Weeks Pregnant</div>
        </div>
        <div style={{ background: "#faf6fa", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#e53986" }}>{patientData.vitals.bloodPressure}</div>
          <div style={{ color: "#666" }}>Blood Pressure</div>
        </div>
        <div style={{ background: "#faf6fa", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#e53986" }}>{patientData.vitals.weight}</div>
          <div style={{ color: "#666" }}>Current Weight</div>
        </div>
        <div style={{ background: "#faf6fa", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#e53986" }}>{patientData.nextAppointment}</div>
          <div style={{ color: "#666" }}>Next Appointment</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Recent Activity */}
        <section>
          <h3 style={{ color: "#e53986", marginBottom: "15px" }}>Recent Activity</h3>
          <div style={{ background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            {recentLogs.map((log, index) => (
              <div key={index} style={{ 
                padding: "15px 0", 
                borderBottom: index < recentLogs.length - 1 ? "1px solid #eee" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{log.type}</div>
                  <div style={{ color: "#666", fontSize: "14px" }}>{log.concern}</div>
                  <div style={{ color: "#999", fontSize: "12px" }}>{log.date}</div>
                </div>
                <span style={{ 
                  padding: "4px 8px", 
                  borderRadius: "12px", 
                  fontSize: "12px",
                  background: log.status === "Completed" ? "#d4edda" : log.status === "Reviewed" ? "#d1ecf1" : "#fff3cd",
                  color: log.status === "Completed" ? "#155724" : log.status === "Reviewed" ? "#0c5460" : "#856404"
                }}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Tasks */}
        <section>
          <h3 style={{ color: "#e53986", marginBottom: "15px" }}>Today's Tasks</h3>
          <div style={{ background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            {upcomingTasks.map((task, index) => (
              <div key={index} style={{ 
                padding: "10px 0", 
                borderBottom: index < upcomingTasks.length - 1 ? "1px solid #eee" : "none",
                display: "flex",
                alignItems: "center"
              }}>
                <input type="checkbox" style={{ marginRight: "10px" }} />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <button style={{
          background: "#e53986",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Record Voice Note
        </button>
        <button style={{
          background: "#fff",
          color: "#e53986",
          border: "2px solid #e53986",
          padding: "12px 24px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Schedule Appointment
        </button>
        <button style={{
          background: "#fff",
          color: "#e53986",
          border: "2px solid #e53986",
          padding: "12px 24px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Emergency Contact
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
