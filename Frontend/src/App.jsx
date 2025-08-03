import React, { useState } from "react";
import Login from "./auth/Login";
import Header from "./navbar/Header";

const App = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginSuccess = (user) => {
    // Handle login success (e.g., close login)
    setShowLogin(false);
  };

  return (
    <div>
      <Header />
      {showLogin && <Login onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />}
      {/* Your other page content here */}
    </div>
  );
};

export default App;
