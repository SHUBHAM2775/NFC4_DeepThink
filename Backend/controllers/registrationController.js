const User = require("../models/user");
const AshaWorker = require("../models/ashaworker");
const PregnantLady = require("../models/pregnantlady");

const registerAdmin = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      return res
        .status(400)
        .json({ error: "Name and phone number are required" });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    const user = await User.create({
      phoneNumber,
      role: "admin",
      roleRef: "Admin",
      refId: null,
      otp: null,
      name,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("Error in registerAdmin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const { geocodeAddress } = require("../utils/geocode");

const registerAshaWorker = async (req, res) => {
  try {
    const {
      ashaId,
      name,
      phoneNumber,
      documents,
      phc,
      village,
      district,
      state,
    } = req.body;

    if (!ashaId || !name || !phoneNumber) {
      return res.status(400).json({
        error: "ashaId, name, and phoneNumber are required",
      });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    const existingAshaWorker = await AshaWorker.findOne({ ashaId });
    if (existingAshaWorker) {
      return res
        .status(400)
        .json({ error: "ASHA worker with this ID already exists" });
    }

    const fullAddress = `${village || ""}, ${district || ""}, ${state || ""}`;
    let coordinates;

    try {
      coordinates = await geocodeAddress(fullAddress);
    } catch (e) {
      console.error("Geocoding failed:", e.message);
    }

    const isValidCoordinates =
      Array.isArray(coordinates) &&
      coordinates.length === 2 &&
      !isNaN(coordinates[0]) &&
      !isNaN(coordinates[1]);

    const ashaWorkerData = {
      ashaId,
      name,
      phoneNumber,
      documents,
      phc,
      village,
      district,
      state,
    };

    if (isValidCoordinates) {
      ashaWorkerData.location = {
        type: "Point",
        coordinates,
      };
    }

    const ashaWorker = await AshaWorker.create(ashaWorkerData);

    const user = await User.create({
      phoneNumber,
      role: "asha_worker",
      roleRef: "AshaWorker",
      refId: ashaWorker._id,
      name,
    });

    res.status(201).json({
      message: "Asha Worker registered successfully",
      userId: user._id,
      ashaWorkerId: ashaWorker._id,
    });
  } catch (err) {
    console.error("Error in registerAshaWorker:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
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
      hasMobileInEmergency,
    } = req.body;

    if (
      !name ||
      !phoneNumber ||
      currentlyPregnant === undefined ||
      firstPregnancy === undefined ||
      visitedDoctorOrASHA === undefined ||
      !monthsPregnant ||
      knownHealthIssues === undefined ||
      recentSymptoms === undefined ||
      takingSupplements === undefined ||
      hasMobileInEmergency === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    const boolToAnswer = (value) => {
      if (value === true || value === "true") return "yes";
      if (value === false || value === "false") return "no";
      if (value === "unsure" || value === "not sure") return "not sure";
      return "no";
    };

    const fullAddress = `${village || ""}, ${district || ""}, ${state || ""}`;
    const coordinates = await geocodeAddress(fullAddress);

    const lady = await PregnantLady.create({
      name,
      phoneNumber,
      village,
      district,
      state,
      currentlyPregnant: boolToAnswer(currentlyPregnant),
      firstPregnancy: boolToAnswer(firstPregnancy),
      visitedDoctorOrASHA: boolToAnswer(visitedDoctorOrASHA),
      monthsPregnant: parseInt(monthsPregnant) || 1,
      knownHealthIssues: boolToAnswer(knownHealthIssues),
      recentSymptoms: boolToAnswer(recentSymptoms),
      takingSupplements: boolToAnswer(takingSupplements),
      hasMobileInEmergency: boolToAnswer(hasMobileInEmergency),
      ...(coordinates && {
        location: { type: "Point", coordinates },
      }),
    });

    const user = await User.create({
      phoneNumber,
      role: "pregnant_lady",
      roleRef: "PregnantLady",
      refId: lady._id,
      name,
    });

    res.status(201).json({
      message: "Pregnant lady registered successfully",
      userId: user._id,
      ladyId: lady._id,
    });
  } catch (err) {
    console.error("Error in registerPregnantLady:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

module.exports = { registerAdmin, registerAshaWorker, registerPregnantLady };
