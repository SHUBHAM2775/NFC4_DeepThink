const User = require("../models/user");

// Generate a random 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

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

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    // 🚫 For now, just return the OTP (later: integrate Twilio)
    console.log(`Generated OTP for ${phoneNumber}: ${otp}`);

    res.status(200).json({
      message: "OTP sent successfully (mocked)",
      otp, // return only in dev mode!
    });
  } catch (err) {
    console.error("Error in requestOtp:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// === Step 2: Verify OTP ===
const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res
        .status(400)
        .json({ error: "Phone number and OTP are required" });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    // Optional: clear OTP after successful login
    user.otp = null;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        roleRef: user.roleRef,
        refId: user.refId,
      },
    });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    res.status(500).json({ error: "Internal server error" });
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
