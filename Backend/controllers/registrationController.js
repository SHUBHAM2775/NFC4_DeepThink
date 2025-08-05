const User = require("../models/user");
const AshaWorker = require("../models/ashaworker");
const PregnantLady = require("../models/pregnantlady");


const registerAdmin = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ error: "Name and phone number are required" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "User with this phone number already exists" });
    }

    // Create user with role = 'admin'
    const user = await User.create({
      phoneNumber,
      role: "admin",
      roleRef: "Admin",
      refId: null, 
      otp: null,  
      name         
    });

    res.status(201).json({
      message: "Admin registered successfully",
      userId: user._id
    });

  } catch (err) {
    console.error("Error in registerAdmin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const registerAshaWorker = async (req, res) => {
  try {
    const { ashaId, name, phoneNumber, documents, phc, village, district, state } = req.body;

    // Validate required fields
    if (!ashaId || !name || !phoneNumber) {
      return res.status(400).json({ error: "ashaId, name, and phoneNumber are required" });
    }

    // Check if phone already exists in User
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "User with this phone number already exists" });
    }

    // Create AshaWorker
    const ashaWorker = await AshaWorker.create({
      ashaId,
      name,
      phoneNumber,
      documents,
      phc,
      village,
      district,
      state
    });

    // Create User linked to AshaWorker
    const user = await User.create({
      phoneNumber,
      role: "asha_worker",
      roleRef: "AshaWorker",
      refId: ashaWorker._id,
      name
    });

    res.status(201).json({
      message: "Asha Worker registered successfully",
      userId: user._id,
      ashaWorkerId: ashaWorker._id
    });

  } catch (err) {
    console.error("Error in registerAshaWorker:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const registerPregnantLady = async (req, res) => {
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
      hasMobileInEmergency
    } = req.body;

    // Validate required fields
    if (!name || !phoneNumber || !currentlyPregnant || !firstPregnancy ||
        !visitedDoctorOrASHA || !monthsPregnant || !knownHealthIssues ||
        !recentSymptoms || !takingSupplements || !hasMobileInEmergency) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if phone already exists in User collection
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "User with this phone number already exists" });
    }

    // Create PregnantLady record
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
      hasMobileInEmergency
    });

    // Create corresponding User
    const user = await User.create({
      phoneNumber,
      role: "pregnant_lady",
      roleRef: "PregnantLady",
      refId: lady._id,
      name
    });

    res.status(201).json({
      message: "Pregnant lady registered successfully",
      userId: user._id,
      ladyId: lady._id
    });

  } catch (err) {
    console.error("Error in registerPregnantLady:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerAdmin, registerAshaWorker, registerPregnantLady };
