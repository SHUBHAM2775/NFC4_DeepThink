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

    // Check if phone number is exactly 10 digits
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanPhone.length === 10) {
      // Special case: Only 9619200100 should use Twilio
      if (cleanPhone === '9619200100') {
        try {
          const verification = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SID)
            .verifications.create({
              to: `+91${phoneNumber}`,
              channel: "sms",
            });

          res.status(200).json({
            message: "OTP sent via Twilio",
            sid: verification.sid,
            useRealOtp: true
          });
        } catch (twilioError) {
          console.error("Twilio error for 9619200100:", twilioError);
          return res.status(500).json({ 
            error: "Failed to send OTP via Twilio",
            details: twilioError.message
          });
        }
      } else {
        // For all other 10-digit numbers: use demo mode with OTP "1"
        res.status(200).json({
          message: "Demo mode: Use OTP '1'",
          useRealOtp: false
        });
      }
    } else {
      // For non-10-digit numbers, use demo mode with OTP "1"
      res.status(200).json({
        message: "Demo mode: Use OTP '1'",
        useRealOtp: false
      });
    }
  } catch (err) {
    console.error("Error in requestOtp:", err);
    
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

    // Check if phone number is exactly 10 digits
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanPhone.length === 10) {
      // Special case: Only 9619200100 should use Twilio verification
      if (cleanPhone === '9619200100') {
        try {
          const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SID)
            .verificationChecks.create({
              to: `+91${phoneNumber}`,
              code: otp,
            });

          if (verificationCheck.status !== "approved") {
            return res.status(401).json({ error: "Invalid or expired OTP" });
          }
        } catch (twilioError) {
          console.error("Twilio verification error for 9619200100:", twilioError);
          if (twilioError.code === 20404) {
            return res.status(404).json({ 
              error: "Invalid verification code",
              details: "The verification code you entered is incorrect or has expired. Please try again."
            });
          }
          return res.status(500).json({ 
            error: "Failed to verify OTP via Twilio",
            details: twilioError.message
          });
        }
      } else {
        // For all other 10-digit numbers, check if OTP is "1"
        if (otp !== "1") {
          return res.status(401).json({ error: "Invalid OTP. Use '1' for demo mode." });
        }
      }
    } else {
      // For non-10-digit numbers, check if OTP is "1"
      if (otp !== "1") {
        return res.status(401).json({ error: "Invalid OTP. Use '1' for demo mode." });
      }
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
