const AshaWorker = require("../models/ashaworker");
const PregnantLady = require("../models/pregnantlady");
const EmergencyContact = require("../models/emergencyContact");

const getNearbyAshaWorkers = async (req, res) => {
  try {
    const { pregnantLadyId } = req.params;

    const lady = await PregnantLady.findById(pregnantLadyId);

    if (!lady) {
      return res.status(404).json({ error: "Pregnant lady not found" });
    }

    if (!lady.location) {
      console.error("Missing location field.");
      return res.status(400).json({ error: "Location field is missing" });
    }

    if (!Array.isArray(lady.location.coordinates)) {
      console.error("Coordinates are not an array:", lady.location.coordinates);
      return res.status(400).json({ error: "Coordinates must be an array" });
    }

    if (lady.location.coordinates.length !== 2) {
      console.error("Coordinates length invalid:", lady.location.coordinates);
      return res.status(400).json({ error: "Latitude and Longitude required" });
    }

    const [longitude, latitude] = lady.location.coordinates;

    const nearby = await AshaWorker.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, // 10 km
        },
      },
    });

    return res.json({ ashaWorkers: nearby });
  } catch (err) {
    console.error("Error fetching nearby ASHA workers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const assignAshaWorker = async (req, res) => {
  try {
    const { pregnantLadyId, ashaWorkerId } = req.body;

    // Check if both exist
    const lady = await PregnantLady.findById(pregnantLadyId);
    if (!lady)
      return res.status(404).json({ error: "Pregnant lady not found" });

    const worker = await AshaWorker.findById(ashaWorkerId);
    if (!worker)
      return res.status(404).json({ error: "ASHA worker not found" });

    // Assign
    lady.assignedAshaWorker = ashaWorkerId;
    await lady.save();

    return res.json({
      message: "ASHA worker assigned successfully",
      pregnantLady: lady,
    });
  } catch (err) {
    console.error("Error assigning ASHA worker:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPregnantLadyName = async (req, res) => {
  try {
    const { pregnantLadyId } = req.params;

    const lady = await PregnantLady.findById(pregnantLadyId).select("name");

    if (!lady) {
      return res.status(404).json({ error: "Pregnant lady not found" });
    }

    return res.json({ name: lady.name });
  } catch (err) {
    console.error("Error fetching pregnant lady name:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEmergencyContacts = async (req, res) => {
  try {
    const { pregnantLadyId } = req.params;

    const contacts = await EmergencyContact.find({
      pregnantLady: pregnantLadyId,
    });

    return res.json({ contacts });
  } catch (err) {
    console.error("Error fetching emergency contacts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addEmergencyContact = async (req, res) => {
  try {
    const { pregnantLadyId } = req.params;
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      return res
        .status(400)
        .json({ error: "Name and phone number are required" });
    }

    const newContact = new EmergencyContact({
      pregnantLady: pregnantLadyId,
      name,
      phoneNumber,
    });

    await newContact.save();

    return res.json({
      message: "Emergency contact added successfully",
      contact: newContact,
    });
  } catch (err) {
    console.error("Error adding emergency contact:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const emergencyLaborCall = async (req, res) => {
  try {
    const { pregnantLadyId } = req.params;

    // Check if patient exists
    const lady = await PregnantLady.findById(pregnantLadyId);
    if (!lady) {
      return res.status(404).json({ error: "Pregnant lady not found" });
    }

    // Get all emergency contacts for this patient
    const contacts = await EmergencyContact.find({
      pregnantLady: pregnantLadyId,
    });
    if (!contacts.length) {
      return res.status(404).json({ error: "No emergency contacts found" });
    }

    // Pick a random contact
    const randomContact = contacts[Math.floor(Math.random() * contacts.length)];

    return res.json({
      message: "Call this emergency contact immediately",
      contactNumber: randomContact.phoneNumber,
      contactName: randomContact.name,
    });
  } catch (err) {
    console.error("Error fetching emergency contact:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const assignPatientToAshaWorker = async (req, res) => {
  try {
    const { pregnantLadyId, ashaWorkerId } = req.body;

    if (!pregnantLadyId || !ashaWorkerId) {
      return res
        .status(400)
        .json({ error: "pregnantLadyId and ashaWorkerId are required" });
    }

    const patient = await PregnantLady.findByIdAndUpdate(
      pregnantLadyId,
      { assignedAshaWorker: ashaWorkerId },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res
      .status(200)
      .json({ message: "Patient assigned to ASHA worker", patient });
  } catch (error) {
    console.error("Error assigning patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPatientsForAshaWorker = async (req, res) => {
  try {
    const { ashaWorkerId } = req.params;

    const patients = await PregnantLady.find(
      { assignedAshaWorker: ashaWorkerId },
      {
        name: 1,
        currentlyPregnant: 1, // We'll use this to determine status
      }
    ).lean();

    // Map to include only required fields
    const patientsWithMinimalData = patients.map((patient) => ({
      name: patient.name,
      status: patient.currentlyPregnant === "yes" ? "Pregnant" : "Not Pregnant",
      complianceScore: "60%", // static value
    }));

    return res.json({ patients: patientsWithMinimalData });
  } catch (err) {
    console.error("Error fetching patients for ASHA worker:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getNearbyAshaWorkers,
  assignAshaWorker,
  getPregnantLadyName,
  getEmergencyContacts,
  addEmergencyContact,
  emergencyLaborCall,
  assignPatientToAshaWorker,
  getPatientsForAshaWorker,
};
