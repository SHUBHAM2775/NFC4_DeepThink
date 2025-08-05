import React, { useState } from "react";
import Login from "./auth/Login";
import Questionaire from "./components/Patient/Questionaire";
import AshaQuestionaire from "./components/ASHA_worker/Questionaire";
import LandingPage from "./components/LandingPage";
import PatientDashboard from "./components/Patient/Dashboard";
import AshaDashboard from "./components/ASHA_worker/Dashboard";
import AdminDashboard from "./components/Admin_Panel/Dashboard";
import Loading from "./components/Loading";
import { registerAdmin, registerAshaWorker, registerPregnantLady } from "./services/registrationAPI";

const App = () => {
  const [currentView, setCurrentView] = useState("landing"); // "landing", "login", "questionnaire", "asha-questionnaire", "patient-dashboard", "asha-dashboard", "admin-dashboard", "main"
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSuccess = async (userData) => {
    setUser(userData);
    setError("");
    
    // Route based on user role and whether it's signup or login
    if (userData.name) {
      // Signup flow - has name field
      if (userData.role === "Patient/Family") {
        setCurrentView("questionnaire");
      } else if (userData.role === "ASHA Worker") {
        setCurrentView("asha-questionnaire");
      } else if (userData.role === "Admin") {
        // For Admin, register immediately after signup
        setIsLoading(true);
        try {
          const result = await registerAdmin(userData);
          console.log("Admin registered successfully:", result);
          setCurrentView("admin-dashboard");
        } catch (error) {
          console.error("Failed to register admin:", error);
          setError("Failed to register admin. Please try again.");
          setCurrentView("login");
        } finally {
          setIsLoading(false);
        }
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

  const handleQuestionnaireComplete = async (questionnaireData) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Call the API to register pregnant lady
      const result = await registerPregnantLady(user, questionnaireData);
      console.log("Pregnant lady registered successfully:", result);
      
      // Update user data with questionnaire responses and registration result
      setUser({
        ...user,
        questionnaireData,
        userId: result.userId,
        ladyId: result.ladyId
      });
      
      // After successful registration, route to patient dashboard
      setCurrentView("patient-dashboard");
    } catch (error) {
      console.error("Failed to register pregnant lady:", error);
      setError("Failed to complete registration. Please try again.");
      // Stay on questionnaire page to allow retry
    } finally {
      setIsLoading(false);
    }
  };

  const handleAshaQuestionnaireComplete = async (questionnaireData) => {
    setIsLoading(true);
    setError("");
    
    console.log("App.jsx - handleAshaQuestionnaireComplete called with:", {
      user,
      questionnaireData
    });
    
    try {
      // Call the API to register ASHA worker
      const result = await registerAshaWorker(user, questionnaireData);
      console.log("ASHA worker registered successfully:", result);
      
      // Update user data with ASHA questionnaire responses and registration result
      setUser({
        ...user,
        ashaQuestionnaireData: questionnaireData,
        userId: result.userId,
        ashaWorkerId: result.ashaWorkerId
      });
      
      // After successful registration, route to ASHA dashboard
      setCurrentView("asha-dashboard");
    } catch (error) {
      console.error("Failed to register ASHA worker:", error);
      
      // Show detailed error message
      let errorMessage = "Failed to complete registration. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.details) {
        console.log("Error details:", error.details);
        if (typeof error.details === 'string') {
          errorMessage += ` Details: ${error.details}`;
        } else if (Array.isArray(error.details)) {
          errorMessage += ` Details: ${error.details.join(', ')}`;
        }
      }
      
      setError(errorMessage);
      // Stay on questionnaire page to allow retry
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage onNavigateToLogin={() => setCurrentView("login")} />;
      case "login":
        return (
          <Login 
            onSuccess={handleLoginSuccess} 
            onClose={() => {
              setCurrentView("landing");
              setError("");
            }}
            externalError={error}
          />
        );
      case "questionnaire":
        return (
          <Questionaire 
            onComplete={handleQuestionnaireComplete}
            user={user}
            isLoading={isLoading}
            error={error}
          />
        );
      case "asha-questionnaire":
        return (
          <AshaQuestionaire 
            onComplete={handleAshaQuestionnaireComplete}
            user={user}
            isLoading={isLoading}
            error={error}
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
      {isLoading && <Loading message="Registering your account..." />}
    </div>
  );
};

export default App;
