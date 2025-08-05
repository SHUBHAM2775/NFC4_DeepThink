import React, { useState, useRef } from "react";
import { useTranslation } from 'react-i18next';

const Header = ({ user, onLogout, onLoginClick }) => {
  const { i18n, t } = useTranslation();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "mr", name: "मराठी" },
  ];

  const getCurrentLanguageName = () => {
    const currentLang = languageOptions.find((lang) => lang.code === i18n.language);
    return currentLang ? currentLang.name : "English";
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  return (
    <header className="bg-white shadow-md px-8 py-4 flex items-center justify-between border-b border-black/10">
      {/* Left: Welcome Message */}
      <div>
        {user ? (
          <>
            <h1 className="text-2xl font-bold text-pink-600 m-0 mb-1">
              {t("header.welcomeMessage")}
            </h1>
            <p className="text-base text-gray-600 m-0">
              {user.name || "User"}
            </p>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-pink-600 m-0">
            {t("header.appTitle")}
          </h1>
        )}
      </div>

      {/* Right: Language Dropdown and Logout */}
      <div className="flex items-center gap-4">
        {/* Language Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer text-sm text-gray-600 font-medium hover:bg-slate-100 transition-colors"
          >
            <span className="mr-2 text-base">🌐</span>
            <span>{getCurrentLanguageName()}</span>
            <span className={`ml-2 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : 'rotate-0'}`}>
              ▼
            </span>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-50">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                    i18n.language === lang.code 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button - Always visible when onLogout is provided */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="bg-pink-600 hover:bg-pink-700 text-white border-0 rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer transition-colors"
          >
            {t("header.logout")}
          </button>
        )}

        {/* Login/Signup Button */}
        {!user && onLoginClick && (
          <button
            onClick={onLoginClick}
            className="bg-pink-600 hover:bg-pink-700 text-white border-0 rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer transition-colors"
          >
            {t("header.loginSignup")}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
