const express = require("express");
const router = express.Router();
const {
  getHighRiskPregnantLadiesCount,
  getAshaWorkerName,
  getAshaWorkerVerificationStatus,
<<<<<<< HEAD
  getNearbyAshaWorkers,
=======
  getHighRiskPatients,
  getAshaWorkerPatients,
  getAshaWorkerStats,
>>>>>>> beb1564bf3c79ffb7fab1061f4448be3d33e5f20
} = require("../controllers/ashaWorkerController");

// Get high risk pregnant ladies count
router.get("/pregnant-ladies/high-risk/count", getHighRiskPregnantLadiesCount);

// Get high risk patients detailed list
router.get("/pregnant-ladies/high-risk", getHighRiskPatients);

// Get ASHA worker name by ID
router.get("/:ashaId/name", getAshaWorkerName);

// Get ASHA worker verification status
router.get("/:ashaId/verification-status", getAshaWorkerVerificationStatus);

<<<<<<< HEAD
router.get("/:pregnantLadyId/nearby-asha-workers", getNearbyAshaWorkers);
=======
// Get patients assigned to specific ASHA worker
router.get("/:ashaId/patients", getAshaWorkerPatients);

// Get ASHA worker statistics
router.get("/:ashaId/stats", getAshaWorkerStats);
>>>>>>> beb1564bf3c79ffb7fab1061f4448be3d33e5f20

module.exports = router;
