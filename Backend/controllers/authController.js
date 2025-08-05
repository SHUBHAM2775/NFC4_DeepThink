const User = require("../models/User");
const mongoose = require("mongoose");

// Use this for testing. You can change to real OTPs later.
const TEST_OTP = "123456";

// ✅ Store OTP on send
exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // In production, generate OTP dynamically
  const generatedOtp = TEST_OTP;

  // Upsert user or update existing one
  const user = await User.findOneAndUpdate(
    { phoneNumber },
    { otp: generatedOtp }, // ✅ Store OTP here
    { new: true }
  );

  // If user doesn't exist yet, this does not create it
  // You can choose to auto-create a user skeleton here if needed

  console.log(`OTP for ${phoneNumber}: ${generatedOtp}`);

  res.status(200).json({
    message: "OTP sent (mock)",
    otp: generatedOtp, // expose only for testing
  });
};

// ✅ Verify OTP & Login
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

  // Optional: Clear OTP after use
  user.otp = null;
  await user.save();

  // Load role-specific data
  const roleModel = mongoose.model(user.roleRef);
  const roleData = await roleModel.findById(user.refId);

  res.status(200).json({
    message: "Login successful",
    role: user.role,
    data: roleData,
  });
};

exports.registerPregnantLady = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      village,
      district,
      state,
      currentlyPregnant,
      firstPregnancy,
      visitedDoctorOrASHA,
      monthsPregnant,
      knownHealthIssues,
      recentSymptoms,
      takingSupplements,
      hasMobileInEmergency,
    } = req.body;

    const lady = await PregnantLady.create({
      name,
      phoneNumber,
      village,
      district,
      state,
      currentlyPregnant,
      firstPregnancy,
      visitedDoctorOrASHA,
      monthsPregnant,
      knownHealthIssues,
      recentSymptoms,
      takingSupplements,
      hasMobileInEmergency,
    });

    await User.create({
      phoneNumber,
      role: "pregnant_lady",
      refId: lady._id,
      roleRef: "PregnantLady",
    });

    res.status(201).json({ message: "Registration successful", data: lady });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (!user) return res.status(404).json({ error: "User not found" });

    const roleModel = mongoose.model(user.roleRef);
    const userData = await roleModel.findById(user.refId);

    res.status(200).json({
      message: "Login successful",
      role: user.role,
      data: userData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
