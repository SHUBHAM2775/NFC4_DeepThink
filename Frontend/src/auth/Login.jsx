import React, { useState } from "react";

const roles = ["Patient/Family", "ASHA Worker", "Admin"];

const LoginSignupToggleTop = ({ onSuccess, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Common states
  const [role, setRole] = useState(roles[0]);
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
    setRole(roles[0]);
    setOtp("");
    setOtpSent(false);
    setError("");
    setName("");
  };

  // Switch login/signup modes, reset form
  const switchMode = (loginMode) => {
    if (loginMode !== isLoginMode) {
      setIsLoginMode(loginMode);
      resetForm();
    }
  };

  // Simulate sending OTP (for login) or completing signup (without OTP)
  const sendOtp = () => {
    setError("");
    if (phone.length <= 4) { // Only +91 with space without number
      setError("Please enter phone number");
      return;
    }
    if (!role) {
      setError("Please select a role");
      return;
    }

    if (!isLoginMode) {
      // Signup validation
      if (!name) {
        setError("Please enter your name");
        return;
      }
      // Simulate signup completion
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Return user data to App.jsx for routing
        const userData = {
          role,
          phone,
          name,
        };
        if (onSuccess) onSuccess(userData);
        else alert(`Welcome ${name}! Account created successfully. Role: ${role}`);
      }, 1000);
      return;
    }

    // For login: send OTP
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setError("");
      alert("(Mock) OTP sent to " + phone + ". Use 1234 to verify.");
    }, 1200);
  };

  // Mock OTP verification
  const verifyOtp = () => {
    setError("");
    if (otp !== "1234") {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        role,
        phone,
      };
      if (onSuccess) onSuccess(userData);
      else alert(`Welcome! Role: ${role}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-white to-pink-50 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative border border-pink-100 p-8">

        {/* Close button */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-pink-600 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
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
              Login
            </button>
            <button
              onClick={() => switchMode(false)}
              aria-pressed={!isLoginMode}
              className={`px-6 py-2 rounded-full transition-colors ${
                !isLoginMode ? "bg-pink-600 text-white" : "text-pink-800 hover:bg-pink-300"
              }`}
              type="button"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-bold mb-6 text-pink-700 text-center tracking-wide">
          {isLoginMode ? "Login" : "Sign Up"}
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
                    placeholder="Name"
                    className="border border-pink-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLoginMode}
                  />
                )}

                <input
                  type="tel"
                  placeholder="+91 Enter your mobile number"
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
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
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

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
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
                      ? "Sending OTP..."
                      : "Creating Account..."
                    : isLoginMode
                      ? "Send OTP"
                      : "Submit"}
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
                  Enter the 4-digit OTP sent to {phone}
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  maxLength="4"
                  className="border border-pink-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-center text-lg tracking-widest"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
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
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            )}
      </div>
    </div>
  );
};

export default LoginSignupToggleTop;
