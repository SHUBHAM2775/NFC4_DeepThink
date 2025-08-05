const User = require("../models/user");

// Generate a random 6-digit OTP
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
// === Step 1: Request OTP ===
const requestOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: `+91${phoneNumber}`,
        channel: "sms",
      });

    res.status(200).json({
      message: "OTP sent via Twilio",
      sid: verification.sid,
    });
  } catch (err) {
    console.error("Error in requestOtp:", err);
    
    // Handle specific Twilio errors
    if (err.code === 21608) {
      return res.status(403).json({ 
        error: "Phone number not verified for trial account",
        details: "This phone number needs to be verified in Twilio console for trial accounts. Please verify it at twilio.com/console/phone-numbers/verified or use a different verified number."
      });
    }
    
    if (err.code === 21614) {
      return res.status(400).json({ 
        error: "Invalid phone number",
        details: "The phone number format is invalid. Please check the number and try again."
      });
    }
    
    // Generic error for other cases
    res.status(500).json({ 
      error: "Failed to send OTP",
      details: err.message || "An unexpected error occurred while sending OTP"
    });
  }
};

// === Step 2: Verify OTP using Twilio Verify ===
const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp, selectedRole } = req.body;

    if (!phoneNumber || !otp) {
      return res
        .status(400)
        .json({ error: "Phone number and OTP are required" });
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: `+91${phoneNumber}`,
        code: otp,
      });

    if (verificationCheck.status !== "approved") {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "OTP verified. Login successful.",
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role, // Return database role for reference
        roleRef: user.roleRef,
        refId: user.refId,
      },
      selectedRole: selectedRole, // Return the selected role for frontend routing
    });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    
    // Handle specific Twilio errors
    if (err.code === 20404) {
      return res.status(404).json({ 
        error: "Invalid verification code",
        details: "The verification code you entered is incorrect or has expired. Please try again."
      });
    }
    
    if (err.code === 21608) {
      return res.status(403).json({ 
        error: "Phone number not verified for trial account",
        details: "This phone number needs to be verified in Twilio console for trial accounts."
      });
    }
    
    // Generic error for other cases
    res.status(500).json({ 
      error: "Failed to verify OTP",
      details: err.message || "An unexpected error occurred while verifying OTP"
    });
  }
};

const getTotalNonAdminUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments({
      role: { $in: ["asha_worker", "pregnant_lady"] },
    });

    res.status(200).json({
      message: "Total non-admin user count fetched successfully",
      totalUsers: count,
    });
  } catch (err) {
    console.error("Error in getTotalNonAdminUserCount:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  getTotalNonAdminUserCount,
};
