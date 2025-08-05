import React from "react";
import { useTranslation } from 'react-i18next';
import Header from "../../navbar/Header";

// Use outline (hollow) Heroicons
import {
  UserGroupIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  UserCircleIcon,
  DocumentTextIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

const Dashboard = ({ user }) => {
  const { t } = useTranslation();

  // Dummy Data with translations
  const summaryStats = [
    { label: t('ashaDashboard.summaryStats.assignedPatients'), value: 3, icon: <UserGroupIcon style={{ width: 32, height: 32, color: "#e53986", margin: "0 auto", display: "block" }} /> },
    { label: t('ashaDashboard.summaryStats.highRisk'), value: 2, icon: <FlagIcon style={{ width: 32, height: 32, color: "#e53986", margin: "0 auto", display: "block" }} /> },
    { label: t('ashaDashboard.summaryStats.missedLogs'), value: 4, icon: <ExclamationTriangleIcon style={{ width: 32, height: 32, color: "#ffc857", margin: "0 auto", display: "block" }} /> },
    { label: t('ashaDashboard.summaryStats.compliance'), value: "85%", icon: <CheckBadgeIcon style={{ width: 32, height: 32, color: "#37b86c", margin: "0 auto", display: "block" }} /> }
  ];

  const formatTimeText = (timeKey, number = null) => {
    if (timeKey === 'today') {
      return t('ashaDashboard.timeLabels.today');
    } else if (timeKey === 'daysAgo' && number) {
      return `${number} ${t('ashaDashboard.timeLabels.daysAgo')}`;
    } else if (timeKey === 'dayAgo' && number) {
      return `${number} ${t('ashaDashboard.timeLabels.dayAgo')}`;
    }
    return t(`ashaDashboard.timeLabels.${timeKey}`);
  };

  const patients = [
    {
      name: "Priya Sharma",
      due: "2024-03-15",
      lastLog: formatTimeText('daysAgo', 2),
      risk: "high",
      compliance: 60,
      missed: 3
    },
    {
      name: "Anita Patel",
      due: "2024-04-20",
      lastLog: formatTimeText('dayAgo', 1),
      risk: "medium",
      compliance: 80,
      missed: 1
    },
    {
      name: "Kavya Singh",
      due: "2024-05-10",
      lastLog: formatTimeText('today'),
      risk: "low",
      compliance: 95,
      missed: 0
    }
  ];

  const riskMap = {
    high: { label: t('ashaDashboard.riskLevels.high'), bg: "#ffd6dc", color: "#c62828" },
    medium: { label: t('ashaDashboard.riskLevels.medium'), bg: "#e4f4fa", color: "#1580bb" },
    low: { label: t('ashaDashboard.riskLevels.low'), bg: "#e7faed", color: "#37b86c" }
  };

  const missedLogColor = {
    high: "#f08383",
    medium: "#ffc857",
    low: "#a3a3a3"
  };

  const handleContact = name => alert(t('ashaDashboard.contactingMessage', { name }));
  const handleNotes = name => alert(t('ashaDashboard.viewingNotesMessage', { name }));

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <div style={{
      fontFamily: "sans-serif",
      background: "#f8f9fb",
      minHeight: "100vh"
    }}>
      <Header
        user={user || { name: t('ashaDashboard.userName') }}
        onLogout={handleLogout}
      />

      {/* Summary Cards */}
      <div style={{
        display: "flex",
        gap: 27,
        margin: "30px auto 22px auto",
        maxWidth: 1060,
        justifyContent: "center"
      }}>
        {summaryStats.map((stat, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 11,
              boxShadow: "0 1.5px 10px #edcce21a",
              padding: "21px 0",
              textAlign: "center",
              minWidth: 170
            }}
          >
            <div style={{ fontSize: 30 }}>
              {stat.icon}
            </div>
            <div style={{
              fontWeight: 800,
              fontSize: 23,
              color: idx === 3 ? "#37b86c" : "#e53986",
              margin: "7px 0 1px 0"
            }}>{stat.value}</div>
            <div style={{ color: "#9595a6", fontSize: 15 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* My Patients Section */}
      <div style={{
        background: "#fff",
        borderRadius: 13,
        boxShadow: "0 2.5px 14px #e9ddebdc",
        maxWidth: 1080,
        margin: "0 auto 34px auto",
        padding: "6px 0 22px 0"
      }}>
        <h3 style={{
          color: "#e53986",
          margin: "22px 0 15px 45px",
          fontWeight: 700,
          fontSize: 21.5
        }}>
          <UserCircleIcon style={{ width: 23, height: 23, color: "#e53986", marginRight: 6, verticalAlign: "middle", display: "inline" }} />
          {t('ashaDashboard.myPatients')}
        </h3>
        {patients.map((p, i) => (
          <div
            key={p.name}
            style={{
              borderRadius: 11,
              padding: "16px 32px 13px 32px",
              margin: "0 22px 16px 22px",
              border: "1.4px solid #f3e4f5",
              background: "#fff",
              boxShadow: "0 1px 5px #f4e2f71c",
              position: "relative"
            }}
          >
            {/* Top Row: Name and risk badge */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 17, color: "#222" }}>{p.name}</span>
              <span style={{
                ...riskMap[p.risk],
                display: "inline-block",
                marginLeft: 10,
                padding: "2.3px 14px",
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 13,
                textTransform: "capitalize"
              }}>
                {riskMap[p.risk].label}
              </span>
              {p.missed > 0 &&
                <span style={{
                  fontSize: 13,
                  marginLeft: 11,
                  color: missedLogColor[p.risk],
                  fontWeight: 500
                }}>
                  {p.missed} {t('ashaDashboard.patientCard.missedLogs')}
                </span>}
            </div>
            {/* Due and last log */}
            <div style={{
              fontSize: 13.5,
              margin: "5px 0 3px 0",
              color: "#676778"
            }}>
              {t('ashaDashboard.patientCard.due')}: {p.due} &nbsp;&nbsp; | &nbsp;&nbsp; {t('ashaDashboard.patientCard.lastLog')}: {p.lastLog}
            </div>
            {/* Compliance Score */}
            <div style={{
              fontSize: 13,
              color: "#8b8a90",
              fontWeight: "bold",
              marginTop: 5
            }}>
              {t('ashaDashboard.patientCard.complianceScore')}
            </div>
            {/* Bar */}
            <div style={{
              background: "#efe2ee",
              height: 17,
              borderRadius: 6,
              margin: "5px 0 0 0",
              width: "100%",
              minWidth: 260,
              maxWidth: 440,
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: `${p.compliance}%`,
                background: "#e53986",
                borderRadius: "6px 0 0 6px",
                position: "absolute"
              }} />
              <div style={{
                color: "#2f2f2f",
                fontSize: 13,
                position: "absolute",
                right: 13,
                top: 2,
                fontWeight: 600
              }}>
                {p.compliance}%
              </div>
            </div>
            {/* View & Call Buttons Row */}
            <div style={{ display: "flex", marginTop: 10, alignItems: "center", gap: 0 }}>
              <button
                style={{
                  background: "#faf6fa",
                  color: "#222",
                  fontWeight: 500,
                  fontSize: 14.3,
                  borderRadius: 6,
                  border: "none",
                  padding: "7px 21px",
                  marginRight: 10,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  boxShadow: "0 0.5px 2px #7441a30c"
                }}
                onClick={() => handleNotes(p.name)}
              >
                <DocumentTextIcon style={{ width: 18, height: 18, color: "#8a94a6", marginRight: 6, verticalAlign: "middle", display: "inline" }} />
                {t('ashaDashboard.patientCard.viewDetails')}
              </button>
              <button
                style={{
                  background: "#fff",
                  color: "#e53986",
                  fontWeight: 600,
                  border: "1.5px solid #e53986",
                  borderRadius: 6,
                  fontSize: 14.3,
                  padding: "7px 30px",
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer"
                }}
                onClick={() => handleContact(p.name)}
              >
                <PhoneIcon style={{ width: 18, height: 18, color: "#e53986", marginRight: 6, verticalAlign: "middle", display: "inline" }} />
                {t('ashaDashboard.patientCard.call')}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* (Analytics can remain as-is below the cards) */}
    </div>
  );
};

export default Dashboard;
