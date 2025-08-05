const AshaWorker = require("../models/ashaworker");

const getPendingVerifications = async (req, res) => {
  try {
    const pendingWorkers = await AshaWorker.find({
      verificationStatus: "pending",
    }).select("name phoneNumber documents village district state ashaId");

    res.status(200).json({
      message: "Pending verifications fetched successfully",
      count: pendingWorkers.length,
      data: pendingWorkers,
    });
  } catch (err) {
    console.error("Error in getPendingVerifications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getPendingVerifications };
