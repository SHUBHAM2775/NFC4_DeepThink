const User = require("../models/user");
const sendOtp = require("../utils/sendOtp");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    // Twilio handles sending OTP
    await sendOtp(phone);
    return res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to send OTP", details: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP are required" });
  }

  try {
    const client = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Verify OTP using Twilio
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Check if user exists or create new
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, phone: user.phone }, "SECRET_KEY", {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "OTP verified", token });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "OTP verification failed", details: error.message });
  }
};
