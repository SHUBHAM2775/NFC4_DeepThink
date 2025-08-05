import React, { useState } from "react";

const roles = ["Patient/Family", "ASHA Worker", "Admin"];
const languages = ["English", "Hindi", "Spanish", "French"];

const Login = ({ onSuccess, onClose }) => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  // Simulated API
  function fakeSubmit({ name, phone, role, language }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && phone && role) {
          resolve({ user: { name, phone, role, language } });
        } else {
          reject({ message: "Please fill all the fields." });
        }
      }, 1300);
    });
  }

  function verifyOTP({ otp }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === "1234") { // Mock OTP verification
          resolve({ success: true });
        } else {
          reject({ message: "Invalid OTP. Please try again." });
        }
      }, 800);
    });
  }

  // Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !role) {
      setError("Please fill all fields.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fakeSubmit({
        name,
        phone,
        role,
        language,
      });
      setIsLoading(false);
      setShowOTP(true); // Show OTP input after successful submission
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message || "Submission failed");
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter OTP.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await verifyOTP({ otp });
      setIsLoading(false);
      if (onSuccess) onSuccess({ name, phone, role, language });
      else alert(`Welcome ${name}!`);
    } catch (err) {
      setError(err.message || "OTP verification failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-white to-green-50 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-green-100">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-green-600 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 text-green-700 text-center tracking-wide">
          Welcome
        </h2>

          {/* Language Selector at top - only show when not in OTP mode */}
          {!showOTP && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                className="w-full border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={showOTP ? handleOTPSubmit : handleSubmit} className="flex flex-col gap-4">
            {!showOTP ? (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                {/* Phone number */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                {/* Role dropdown */}
                <select
                  className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r[0].toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-600">OTP sent to {phone}</p>
                  <p className="text-sm text-gray-500">Enter the 4-digit code below</p>
                </div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  maxLength="4"
                  className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition text-center text-lg tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
                <button
                  type="button"
                  onClick={() => {setShowOTP(false); setOtp(""); setError("");}}
                  className="text-green-600 hover:text-green-700 text-sm underline"
                >
                  ← Back to form
                </button>
              </>
            )}
            
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mt-2 shadow-md transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Processing..." : showOTP ? "Verify OTP" : "Send OTP"}
            </button>
          </form>
      </div>
    </div>
  );
};

export default Login;
