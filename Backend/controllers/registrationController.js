const Admin = require("../models/admin");
const User = require("../models/user");

const registerAdmin = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    // Check if phone number already exists in User collection
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "User with this phone number already exists" });
    }

    // Create Admin
    const admin = await Admin.create({ name, phoneNumber });

    // Create User entry
    const user = await User.create({
      phoneNumber,
      role: "admin",
      refId: admin._id,
      roleRef: "Admin"
    });

    res.status(201).json({
      message: "Admin registered successfully",
      userId: user._id,
      adminId: admin._id
    });
  } catch (err) {
    console.error("Error in registerAdmin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  registerAdmin,
};