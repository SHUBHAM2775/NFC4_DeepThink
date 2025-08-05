const User = require("../models/user");
const sendOtp = require("../utils/sendOtp");

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone)
    return res.status(400).json({ error: "Phone number is required" });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  let user = await User.findOne({ phone });

  if (!user) {
    user = new User({ phone, otp: { code: otp, expiresAt } });
  } else {
    user.otp = { code: otp, expiresAt };
  }

  await user.save();
  await sendOtp(phone, otp);

  return res.status(200).json({ message: "OTP sent" });
};

const jwt = require("jsonwebtoken");

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });

  if (!user || !user.otp) {
    return res.status(400).json({ error: "User or OTP not found" });
  }

  const isOtpValid = user.otp.code === otp && user.otp.expiresAt > new Date();

  if (!isOtpValid) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.otp = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id, phone: user.phone }, "SECRET_KEY", {
    expiresIn: "1h",
  });

  return res.status(200).json({ message: "OTP verified", token });
};
