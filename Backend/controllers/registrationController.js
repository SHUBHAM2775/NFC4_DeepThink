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
    console.log("Received ASHA Worker registration request:", req.body);
    
    const { ashaId, name, phoneNumber, documents, phc, village, district, state } = req.body;

    // Validate required fields
    if (!ashaId || !name || !phoneNumber) {
      console.log("Missing required fields:", { ashaId: !!ashaId, name: !!name, phoneNumber: !!phoneNumber });
      return res.status(400).json({ 
        error: "ashaId, name, and phoneNumber are required",
        details: {
          ashaId: !ashaId ? "ASHA ID is required" : null,
          name: !name ? "Name is required" : null,
          phoneNumber: !phoneNumber ? "Phone number is required" : null
        }
      });
    }

    // Check if phone already exists in User
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      console.log("User with phone number already exists:", phoneNumber);
      return res.status(400).json({ error: "User with this phone number already exists" });
    }

    // Check if ASHA ID already exists
    const existingAshaWorker = await AshaWorker.findOne({ ashaId });
    if (existingAshaWorker) {
      console.log("ASHA worker with this ID already exists:", ashaId);
      return res.status(400).json({ error: "ASHA worker with this ID already exists" });
    }

    // Create AshaWorker
    console.log("Creating ASHA worker with data:", {
      ashaId, name, phoneNumber, documents, phc, village, district, state
    });
    
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

    console.log("ASHA worker created successfully:", ashaWorker._id);

    // Create User linked to AshaWorker
    const user = await User.create({
      phoneNumber,
      role: "asha_worker",
      roleRef: "AshaWorker",
      refId: ashaWorker._id,
      name
    });

    console.log("User created successfully:", user._id);

    res.status(201).json({
      message: "Asha Worker registered successfully",
      userId: user._id,
      ashaWorkerId: ashaWorker._id
    });

  } catch (err) {
    console.error("Error in registerAshaWorker:", err);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Validation error", 
        details: validationErrors 
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        error: `${duplicateField} already exists`,
        details: `A record with this ${duplicateField} already exists in the database`
      });
    }
    
    res.status(500).json({ 
      error: "Internal server error",
      details: err.message 
    });
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

    console.log("Received data for pregnant lady registration:", req.body);

    // Validate required fields
    if (!name || !phoneNumber || currentlyPregnant === undefined || firstPregnancy === undefined ||
        visitedDoctorOrASHA === undefined || !monthsPregnant || knownHealthIssues === undefined ||
        recentSymptoms === undefined || takingSupplements === undefined || hasMobileInEmergency === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if phone already exists in User collection
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "User with this phone number already exists" });
    }

    // Helper function to convert boolean to string format expected by model
    const boolToAnswer = (value) => {
      if (value === true || value === 'true') return 'yes';
      if (value === false || value === 'false') return 'no';
      if (value === 'unsure' || value === 'not sure') return 'not sure';
      return 'no'; // default fallback
    };

    // Create PregnantLady record with proper string conversions
    const lady = await PregnantLady.create({
      name,
      phoneNumber,
      village: village || "",
      district: district || "",
      state: state || "",
      currentlyPregnant: boolToAnswer(currentlyPregnant),
      firstPregnancy: boolToAnswer(firstPregnancy),
      visitedDoctorOrASHA: boolToAnswer(visitedDoctorOrASHA),
      monthsPregnant: parseInt(monthsPregnant) || 1,
      knownHealthIssues: boolToAnswer(knownHealthIssues),
      recentSymptoms: boolToAnswer(recentSymptoms),
      takingSupplements: boolToAnswer(takingSupplements),
      hasMobileInEmergency: boolToAnswer(hasMobileInEmergency)
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
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

module.exports = { registerAdmin, registerAshaWorker, registerPregnantLady };
