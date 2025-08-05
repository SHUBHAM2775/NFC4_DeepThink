const express = require("express");
const router = express.Router();

const {
  getPendingVerifications,
  updateVerificationStatus,
  getPendingAshaWorkersCount,
  getVerifiedAshaWorkersCount,
  getAshaWorkerDocuments,
} = require("../controllers/verificationController");

router.get("/pending", getPendingVerifications);

router.patch("/:ashaId/status", updateVerificationStatus);

router.get("/pending-asha-workers", getPendingAshaWorkersCount);

router.get("/verified-asha-workers", getVerifiedAshaWorkersCount);

router.get("/:id/show-documents", getAshaWorkerDocuments);

module.exports = router;
