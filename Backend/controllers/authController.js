const User = require("../models/User");
const mongoose = require("mongoose");

const TEST_OTP = "123456";

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const generatedOtp = TEST_OTP;

  const user = await User.findOneAndUpdate(
    { phoneNumber },
    { otp: generatedOtp },
    { new: true }
  );

  console.log(`OTP for ${phoneNumber}: ${generatedOtp}`);

  res.status(200).json({
    message: "OTP sent (mock)",
    otp: generatedOtp,
  });
};

exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.otp !== otp) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  user.otp = null;
  await user.save();

  const roleModel = mongoose.model(user.roleRef);
  const roleData = await roleModel.findById(user.refId);

  res.status(200).json({
    message: "Login successful",
    role: user.role,
    data: roleData,
  });
};
