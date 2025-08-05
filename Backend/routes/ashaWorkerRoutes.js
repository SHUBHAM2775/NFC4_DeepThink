const express = require("express");
const router = express.Router();
const {
  getHighRiskPregnantLadiesCount,
  getAshaWorkerName,
  getAshaWorkerVerificationStatus,
} = require("../controllers/ashaWorkerController");

// Get high risk pregnant ladies count
router.get("/pregnant-ladies/high-risk/count", getHighRiskPregnantLadiesCount);

// Get high risk patients detailed list
router.get("/pregnant-ladies/high-risk", getHighRiskPregnantLadiesCount);

// Get ASHA worker name by ID
router.get("/:ashaId/name", getAshaWorkerName);

// Get ASHA worker verification status
router.get("/:ashaId/verification-status", getAshaWorkerVerificationStatus);

module.exports = router;
