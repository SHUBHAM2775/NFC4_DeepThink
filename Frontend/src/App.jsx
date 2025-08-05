import React, { useState } from "react";
import Login from "./auth/Login";
import Questionaire from "./components/Patient/Questionaire";
import LandingPage from "./components/LandingPage";

const App = () => {
  const [currentView, setCurrentView] = useState("landing"); // "landing", "login", "questionnaire", "main"
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    
    // Route based on user role and signup/login
    if (userData.role === "Patient/Family" && userData.name) {
      // If it's a Patient signup (has name), go to questionnaire
      setCurrentView("questionnaire");
    } else {
      // For login or other roles, go to main app
      setCurrentView("main");
    }
  };

  const handleQuestionnaireComplete = (questionnaireData) => {
    // Update user data with questionnaire responses
    setUser({
      ...user,
      questionnaireData
    });
    setCurrentView("main");
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
      case "main":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Main App!</h1>
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
            </button>
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
