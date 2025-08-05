const express = require("express");
const router = express.Router();
const {
  getHighRiskPregnantLadiesCount,
  getAshaWorkerName,
  getAshaWorkerVerificationStatus,
  getNearbyAshaWorkers,
} = require("../controllers/ashaWorkerController");

router.get("/pregnant-ladies/high-risk/count", getHighRiskPregnantLadiesCount);

router.get("/:ashaId/name", getAshaWorkerName);

router.get("/:ashaId/verification-status", getAshaWorkerVerificationStatus);

router.get("/:pregnantLadyId/nearby-asha-workers", getNearbyAshaWorkers);

module.exports = router;
