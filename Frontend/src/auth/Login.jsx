import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "../navbar/Header";

const LoginSignupToggleTop = ({ onSuccess, onClose, externalError }) => {
  const { t, i18n } = useTranslation();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Breadcrumb data
  const breadcrumbs = [
    { label: t("nav.home", "Home"), path: "/" },
    { label: isLoginMode ? t("auth.login") : t("auth.signup"), path: null }
  ];

  // Define roles using translation keys
  const roles = [
    { key: "patient", value: t("auth.roles.patient"), originalValue: "Patient/Family" },
    { key: "ashaWorker", value: t("auth.roles.ashaWorker"), originalValue: "ASHA Worker" },
    { key: "admin", value: t("auth.roles.admin"), originalValue: "Admin" }
  ];

  // Common states
  const [roleKey, setRoleKey] = useState(roles[0].key); // Store the key instead of translated value
  const [phone, setPhone] = useState("+91 ");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Signup-specific states
  const [name, setName] = useState("");

  // Reset all form fields and state
  const resetForm = () => {
    setPhone("+91 ");
    setRoleKey(roles[0].key); // Reset to first role key
    setOtp("");
    setOtpSent(false);
    setError("");
    setName("");
  };

  // Handle language change - ensure roleKey is still valid
  useEffect(() => {
    // Check if current roleKey is still valid, if not reset to first role
    const validKeys = ["patient", "ashaWorker", "admin"];
    if (!validKeys.includes(roleKey)) {
      setRoleKey("patient");
    }
  }, [i18n.language, roleKey]);

  // Helper function to map database roles to original values
  const mapDatabaseRoleToOriginalValue = (dbRole) => {
    const roleMapping = {
      'pregnant_lady': 'Patient/Family',
      'asha_worker': 'ASHA Worker',
      'admin': 'Admin'
    };
    return roleMapping[dbRole] || dbRole;
  };

  // Switch login/signup modes, reset form
  const switchMode = (loginMode) => {
    if (loginMode !== isLoginMode) {
      setIsLoginMode(loginMode);
      resetForm();
    }
  };

  // Send OTP for login or handle signup
  const sendOtp = async () => {
    setError("");
    if (phone.length <= 4) { // Only +91 with space without number
      setError(t("auth.errors.enterPhone"));
      return;
    }
    if (!roleKey) {
      setError(t("auth.errors.selectRole"));
      return;
    }

    // Get the original English role value for routing
    const selectedRole = roles.find(r => r.key === roleKey);
    const originalRoleValue = selectedRole ? selectedRole.originalValue : roles[0].originalValue;

    if (!isLoginMode) {
      // Signup validation
      if (!name) {
        setError(t("auth.errors.enterName"));
        return;
      }
      // For signup, return user data to handle registration flow
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const userData = {
          role: originalRoleValue, // Use original English value
          phone,
          name,
        };
        if (onSuccess) onSuccess(userData);
      }, 1000);
      return;
    }

    // For login: send real OTP using API
    setIsLoading(true);
    try {
      // Clean phone number - remove +91 and spaces for API call
      const cleanPhone = phone.replace(/\+91\s?/, '').trim();
      
      const response = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: cleanPhone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      setError("");
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err.message || t("auth.errors.failedToSendOTP"));
    } finally {
      setIsLoading(false);
    }
  };

  // Real OTP verification using API
  const verifyOtp = async () => {
    setError("");
    if (otp.length < 6) {
      setError(t("auth.errors.enterCompleteOTP"));
      return;
    }

    setIsLoading(true);
    try {
      // Clean phone number - remove +91 and spaces for API call
      const cleanPhone = phone.replace(/\+91\s?/, '').trim();
      
      // Get the selected role for routing
      const selectedRole = roles.find(r => r.key === roleKey);
      const selectedOriginalRole = selectedRole ? selectedRole.originalValue : roles[0].originalValue;

      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: cleanPhone,
          otp: otp,
          selectedRole: selectedOriginalRole // Send the selected role for routing
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      // Success - get user data and route according to SELECTED role (not database role)
      const userData = {
        id: data.user.id,
        name: data.user.name,
        role: selectedOriginalRole, // Use the role selected during login
        phone: data.user.phoneNumber,
        roleRef: data.user.roleRef,
        refId: data.user.refId,
        databaseRole: data.user.role // Keep original database role for reference
      };

      if (onSuccess) onSuccess(userData);
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(err.message || t("auth.errors.invalidOTP"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-50">
      {/* Header Component */}
      <Header onLoginClick={onClose} />
      
      {/* Breadcrumbs */}
      <nav className="px-8 py-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              {crumb.path ? (
                <button 
                  onClick={onClose}
                  className="text-pink-600 hover:text-pink-800 hover:underline focus:outline-none"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Modal Content */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative border border-pink-100 p-8">

        {/* Close button */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-pink-600 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label={t("auth.close")}
        >
          ×
        </button>

        {/* Top toggle switch centered */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-pink-200 rounded-full p-1 text-sm font-semibold select-none">
            <button
              onClick={() => switchMode(true)}
              aria-pressed={isLoginMode}
              className={`px-6 py-2 rounded-full transition-colors ${
                isLoginMode ? "bg-pink-600 text-white" : "text-pink-800 hover:bg-pink-300"
              }`}
              type="button"
            >
              {t("auth.login")}
            </button>
            <button
              onClick={() => switchMode(false)}
              aria-pressed={!isLoginMode}
              className={`px-6 py-2 rounded-full transition-colors ${
                !isLoginMode ? "bg-pink-600 text-white" : "text-pink-800 hover:bg-pink-300"
              }`}
              type="button"
            >
              {t("auth.signup")}
            </button>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-bold mb-6 text-pink-700 text-center tracking-wide">
          {isLoginMode ? t("auth.login") : t("auth.signup")}
        </h2>

        {/* Login / Signup Forms */}
        {!otpSent && (
              <form
                className="flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendOtp();
                }}
              >
                {!isLoginMode && (
                  <input
                    type="text"
                    placeholder={t("auth.name")}
                    className="border border-pink-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLoginMode}
                  />
                )}

                <input
                  type="tel"
                  placeholder={t("auth.phonePlaceholder")}
                  className="border border-pink-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("+91 ")) {
                      // Keep +91 space and add only digits after it
                      setPhone("+91 " + value.slice(4).replace(/\D/g, ""));
                    } else if (value.replace(/\D/g, "")) {
                      // If user types digits without +91, add it
                      setPhone("+91 " + value.replace(/\D/g, ""));
                    } else {
                      // Reset to +91 space if empty
                      setPhone("+91 ");
                    }
                  }}
                  required
                />

                <select
                  className="border border-pink-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                  value={roleKey}
                  onChange={(e) => setRoleKey(e.target.value)}
                  required
                >
                  {roles.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.value}
                    </option>
                  ))}
                </select>

                {/* Signup extra fields */}
                {/* {!isLoginMode && role === "Patient/Family" && (
                  <input
                    type="number"
                    placeholder="Months Pregnant"
                    min="0"
                    max="9"
                    className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                    value={monthsPregnant}
                    onChange={(e) => setMonthsPregnant(e.target.value)}
                    required={role === "Patient/Family"}
                  />
                )} */}

                {(error || externalError) && (
                  <div className="text-red-500 text-sm text-center">{error || externalError}</div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg mt-2 shadow-md transition-all ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading
                    ? isLoginMode
                      ? t("auth.sendingOTP")
                      : t("auth.creatingAccount")
                    : isLoginMode
                      ? t("auth.sendOTP")
                      : t("auth.submit")}
                </button>
              </form>
            )}

            {/* OTP form for login */}
            {otpSent && isLoginMode && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyOtp();
                }}
                className="flex flex-col gap-4"
              >
                <p className="text-center text-gray-600 mb-2">
                  {t("auth.enterOTPMessage", { phone })}
                </p>
                <input
                  type="text"
                  placeholder={t("auth.enterOTPPlaceholder")}
                  maxLength="6"
                  className="border border-pink-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-center text-lg tracking-widest"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  autoFocus
                />
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError("");
                    }}
                    className="text-pink-600 hover:text-pink-700 text-sm underline focus:outline-none"
                  >
                    {t("auth.back")}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? t("auth.verifying") : t("auth.verifyOTP")}
                  </button>
                </div>
              </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupToggleTop;
