import React from "react";
import Header from "../../navbar/Header";

const Dashboard = ({ user }) => {
  const adminStats = [
    { label: "Total Users", value: 1247, icon: "👤", color: "#e53986" },
    { label: "Active Patients", value: 892, icon: "🤰", color: "#28a745" },
    { label: "ASHA Workers", value: 156, icon: "👩‍⚕️", color: "#17a2b8" },
    { label: "Pending Reviews", value: 23, icon: "⏰", color: "#ffc107" }
  ];

  const recentActivities = [
    { time: "10:30 AM", action: "New patient registered", user: "Priya Sharma", type: "registration" },
    { time: "09:45 AM", action: "Voice log reviewed", user: "Dr. Kumar", type: "review" },
    { time: "09:15 AM", action: "ASHA worker verified", user: "Meera Devi", type: "verification" },
    { time: "08:30 AM", action: "Emergency alert resolved", user: "Lakshmi Singh", type: "emergency" }
  ];

  const systemHealth = {
    serverStatus: "Online",
    lastBackup: "2024-01-20 02:00 AM",
    activeConnections: 342,
    dataUsage: "2.3 TB",
    uptime: "99.9%"
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'registration': return '📝';
      case 'review': return '👁️';
      case 'verification': return '✅';
      case 'emergency': return '🚨';
      default: return '📋';
    }
  };

  const handleLogout = () => {
    window.location.reload(); // Simple logout - reload to go back to landing
  };

  return (
    <div className="admin-dashboard" style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <Header 
        title="Admin Dashboard" 
        userName={user?.name || "Administrator"}
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
          Generate Report
        </button>
        <button style={{ 
          background: "none", 
          border: "1px solid #e53986", 
          color: "#e53986",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Settings
        </button>
      </Header>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        {adminStats.map((stat, index) => (
          <div key={index} style={{ 
            background: "#fff", 
            padding: "25px", 
            borderRadius: "12px", 
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #f0f0f0"
          }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>{stat.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: stat.color, marginBottom: "5px" }}>
              {stat.value.toLocaleString()}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        {/* Recent Activities */}
        <section>
          <h3 style={{ color: "#e53986", marginBottom: "15px" }}>Recent Activities</h3>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            {recentActivities.map((activity, index) => (
              <div key={index} style={{ 
                padding: "15px 0", 
                borderBottom: index < recentActivities.length - 1 ? "1px solid #eee" : "none",
                display: "flex",
                alignItems: "center",
                gap: "15px"
              }}>
                <div style={{ fontSize: "20px" }}>{getActivityIcon(activity.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: "3px" }}>{activity.action}</div>
                  <div style={{ color: "#666", fontSize: "14px" }}>by {activity.user}</div>
                </div>
                <div style={{ color: "#999", fontSize: "12px" }}>{activity.time}</div>
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <button style={{
                color: "#e53986",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline"
              }}>
                View All Activities
              </button>
            </div>
          </div>
        </section>

        {/* System Health */}
        <section>
          <h3 style={{ color: "#e53986", marginBottom: "15px" }}>System Health</h3>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div style={{ marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Server Status</span>
                <span style={{ 
                  color: "#28a745", 
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}>
                  🟢 {systemHealth.serverStatus}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Uptime</span>
                <span style={{ fontWeight: "bold" }}>{systemHealth.uptime}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Active Users</span>
                <span style={{ fontWeight: "bold" }}>{systemHealth.activeConnections}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Data Usage</span>
                <span style={{ fontWeight: "bold" }}>{systemHealth.dataUsage}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Last Backup</span>
                <span style={{ fontWeight: "bold", fontSize: "12px" }}>{systemHealth.lastBackup}</span>
              </div>
            </div>
            <button style={{
              width: "100%",
              background: "#e53986",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}>
              View Detailed Metrics
            </button>
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "30px" }}>
        <h3 style={{ color: "#e53986", marginBottom: "15px" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <button style={{
            background: "#e53986",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            Manage Users
          </button>
          <button style={{
            background: "#28a745",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            Review Verifications
          </button>
          <button style={{
            background: "#17a2b8",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            System Backup
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
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
