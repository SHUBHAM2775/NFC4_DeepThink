import React, { useState } from "react";
import Login from "./auth/Login";
import Questionaire from "./components/Patient/Questionaire";
import AshaQuestionaire from "./components/ASHA_worker/Questionaire";
import LandingPage from "./components/LandingPage";
import PatientDashboard from "./components/Patient/Dashboard";
import AshaDashboard from "./components/ASHA_worker/Dashboard";
import AdminDashboard from "./components/Admin_Panel/Dashboard";

const App = () => {
  const [currentView, setCurrentView] = useState("landing"); // "landing", "login", "questionnaire", "asha-questionnaire", "patient-dashboard", "asha-dashboard", "admin-dashboard", "main"
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    
    // Route based on user role and whether it's signup or login
    if (userData.name) {
      // Signup flow - has name field
      if (userData.role === "Patient/Family") {
        setCurrentView("questionnaire");
      } else if (userData.role === "ASHA Worker") {
        setCurrentView("asha-questionnaire");
      } else if (userData.role === "Admin") {
        setCurrentView("admin-dashboard");
      }
    } else {
      // Login flow - no name field, route directly to dashboards
      if (userData.role === "Patient/Family") {
        setCurrentView("patient-dashboard");
      } else if (userData.role === "ASHA Worker") {
        setCurrentView("asha-dashboard");
      } else if (userData.role === "Admin") {
        setCurrentView("admin-dashboard");
      } else {
        setCurrentView("main");
      }
    }
  };

  const handleQuestionnaireComplete = (questionnaireData) => {
    // Update user data with questionnaire responses
    setUser({
      ...user,
      questionnaireData
    });
    // After questionnaire completion, route to appropriate dashboard
    if (user.role === "Patient/Family") {
      setCurrentView("patient-dashboard");
    } else {
      setCurrentView("main");
    }
  };

  const handleAshaQuestionnaireComplete = (questionnaireData) => {
    // Update user data with ASHA questionnaire responses
    setUser({
      ...user,
      ashaQuestionnaireData: questionnaireData
    });
    // After ASHA questionnaire completion, route to ASHA dashboard
    setCurrentView("asha-dashboard");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage onNavigateToLogin={() => setCurrentView("login")} />;
      case "login":
        return (
          <Login 
            onSuccess={handleLoginSuccess} 
            onClose={() => setCurrentView("landing")} 
          />
        );
      case "questionnaire":
        return (
          <Questionaire 
            onComplete={handleQuestionnaireComplete}
            user={user}
          />
        );
      case "asha-questionnaire":
        return (
          <AshaQuestionaire 
            onComplete={handleAshaQuestionnaireComplete}
            user={user}
          />
        );
      case "patient-dashboard":
        return <PatientDashboard user={user} />;
      case "asha-dashboard":
        return <AshaDashboard user={user} />;
      case "admin-dashboard":
        return <AdminDashboard user={user} />;
      case "main":
        return (
          <div className="p-8">
            {/* <h1 className="text-2xl font-bold mb-4">Welcome to the Main App!</h1>
            {user && (
              <div className="bg-pink-100 p-4 rounded-lg">
                <h2 className="font-semibold">User Info:</h2>
                <p>Role: {user.role}</p>
                <p>Phone: {user.phone}</p>
                {user.name && <p>Name: {user.name}</p>}
                {user.monthsPregnant && <p>Months Pregnant: {user.monthsPregnant}</p>}
                {user.questionnaireData && <p>Questionnaire: Completed</p>}
              </div>
            )}
            <button 
              onClick={() => setCurrentView("login")} 
              className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              Back to Login
            </button> */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderCurrentView()}
    </div>
  );
};

export default App;
