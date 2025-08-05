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

module.exports = {
  getHighRiskPregnantLadiesCount,
  getAshaWorkerName,
  getAshaWorkerVerificationStatus,
};
