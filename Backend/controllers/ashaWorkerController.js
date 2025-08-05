const PregnantLady = require("../models/pregnantlady");
const AshaWorker = require("../models/ashaworker");

const getHighRiskPregnantLadiesCount = async (req, res) => {
  try {
    const count = await PregnantLady.countDocuments({ status: "High" });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching high-risk count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAshaWorkerName = async (req, res) => {
  try {
    const { ashaId } = req.params;

    if (!ashaId) {
      return res.status(400).json({ error: "ashaId is required" });
    }

    const worker = await AshaWorker.findOne({ ashaId });

    if (!worker) {
      return res.status(404).json({ error: "ASHA worker not found" });
    }

    res.status(200).json({ name: worker.name });
  } catch (error) {
    console.error("Error fetching ASHA worker name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAshaWorkerVerificationStatus = async (req, res) => {
  try {
    const { ashaId } = req.params;

    if (!ashaId) {
      return res.status(400).json({ error: "ashaId is required" });
    }

    const worker = await AshaWorker.findOne({ ashaId });

    if (!worker) {
      return res.status(404).json({ error: "ASHA worker not found" });
    }

    res.status(200).json({
      verificationStatus: worker.verificationStatus,
    });
  } catch (error) {
    console.error("Error fetching ASHA worker verification status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get high risk patients detailed list
const getHighRiskPatients = async (req, res) => {
  try {
    const patients = await PregnantLady.find({ status: "High" })
      .select("name phoneNumber monthsPregnant currentlyPregnant")
      .limit(50); // Limit for performance

    // Transform data for frontend
    const formattedPatients = patients.map((patient) => ({
      name: patient.name,
      phoneNumber: patient.phoneNumber,
      due: "2024-03-15", // Calculate based on months pregnant
      lastLog: "2 days ago", // This would come from voice logs
      risk: "high",
      compliance: Math.floor(Math.random() * 40) + 40, // Random between 40-80 for high risk
      missed: Math.floor(Math.random() * 5) + 1, // Random 1-5 missed logs
      animation: true,
    }));

    res.status(200).json(formattedPatients);
  } catch (error) {
    console.error("Error fetching high risk patients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get patients assigned to specific ASHA worker
const getAshaWorkerPatients = async (req, res) => {
  try {
    const { ashaId } = req.params;

    if (!ashaId) {
      return res.status(400).json({ error: "ashaId is required" });
    }

    // For now, return demo data since we don't have patient-ASHA mapping
    // In a real implementation, you'd have a field linking patients to ASHA workers
    const demoPatients = [
      {
        name: "Priya Sharma",
        phoneNumber: "8669212403",
        due: "2024-03-15",
        lastLog: "2 days ago",
        risk: "high",
        compliance: 60,
        missed: 3,
        animation: true,
      },
      {
        name: "Anita Patel",
        phoneNumber: "9876543211",
        due: "2024-04-20",
        lastLog: "1 day ago",
        risk: "medium",
        compliance: 80,
        missed: 1,
        animation: false,
      },
      {
        name: "Kavya Singh",
        phoneNumber: "9876543212",
        due: "2024-05-10",
        lastLog: "Today",
        risk: "low",
        compliance: 95,
        missed: 0,
        animation: false,
      },
    ];

    res.status(200).json(demoPatients);
  } catch (error) {
    console.error("Error fetching ASHA worker patients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get ASHA worker statistics
const getAshaWorkerStats = async (req, res) => {
  try {
    const { ashaId } = req.params;

    if (!ashaId) {
      return res.status(400).json({ error: "ashaId is required" });
    }

    // In a real implementation, these would be calculated from actual data
    const stats = {
      assignedPatients: 3,
      missedLogs: 4,
      compliance: "85%",
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching ASHA worker statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPregnantLadies = async (req, res) => {
  try {
    const { district, state, village } = req.query; // optional filters

    // Build query dynamically
    const query = {};
    if (district) query.district = district;
    if (state) query.state = state;
    if (village) query.village = village;

    const pregnantLadies = await PregnantLady.find(query).lean();

    return res.json({ pregnantLadies });
  } catch (err) {
    console.error("Error fetching pregnant ladies:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getHighRiskPregnantLadiesCount,
  getAshaWorkerName,
  getAshaWorkerVerificationStatus,
  getHighRiskPatients,
  getAshaWorkerPatients,
  getAshaWorkerStats,
  getAllPregnantLadies,
};
