import React, { useState, useRef } from "react";

const Header = ({ user, onLanguageChange, onLogout, onLoginClick, currentLanguage = "en" }) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "mr", name: "मराठी" },
  ];

  const getCurrentLanguageName = () => {
    const currentLang = languageOptions.find((lang) => lang.code === currentLanguage);
    return currentLang ? currentLang.name : "English";
  };

  const handleLanguageChange = (langCode) => {
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    setShowLanguageDropdown(false);
  };

  return (
    <header style={{ 
      background: "#fff", 
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)", 
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      {/* Left: Welcome Message */}
      <div>
        {user ? (
          <>
            <h1 style={{ 
              fontSize: "24px", 
              fontWeight: "700", 
              color: "#e53986", 
              margin: 0,
              marginBottom: "4px"
            }}>
              Welcome to Your Health Journey
            </h1>
            <p style={{ 
              fontSize: "16px", 
              color: "#5e656e", 
              margin: 0 
            }}>
              {user.name || "User"}
            </p>
          </>
        ) : (
          <h1 style={{ 
            fontSize: "24px", 
            fontWeight: "700", 
            color: "#e53986", 
            margin: 0
          }}>
            Maternal Health Tracker
          </h1>
        )}
      </div>

      {/* Right: Language Dropdown and Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Language Dropdown */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f7fafd",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#5e656e",
              fontWeight: "500"
            }}
          >
            <span style={{ marginRight: "8px", fontSize: "16px" }}>🌐</span>
            <span>{getCurrentLanguageName()}</span>
            <span style={{ 
              marginLeft: "8px", 
              transform: showLanguageDropdown ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}>
              ▼
            </span>
          </button>
          
          {showLanguageDropdown && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: "0",
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              padding: "4px 0",
              minWidth: "120px",
              zIndex: 50
            }}>
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    border: "none",
                    background: currentLanguage === lang.code ? "#f0f9ff" : "transparent",
                    color: currentLanguage === lang.code ? "#0369a1" : "#5e656e",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#f3f4f6"}
                  onMouseLeave={(e) => e.target.style.background = currentLanguage === lang.code ? "#f0f9ff" : "transparent"}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        {user && onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: "#e53986",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = "#d1356e"}
            onMouseLeave={(e) => e.target.style.background = "#e53986"}
          >
            Logout
          </button>
        )}

        {/* Login/Signup Button */}
        {!user && onLoginClick && (
          <button
            onClick={onLoginClick}
            style={{
              background: "#e53986",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = "#d1356e"}
            onMouseLeave={(e) => e.target.style.background = "#e53986"}
          >
            Login / Signup
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
