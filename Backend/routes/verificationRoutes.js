const express = require("express");
const router = express.Router();

const {
  getPendingVerifications,
  updateVerificationStatus,
  getPendingAshaWorkersCount,
} = require("../controllers/verificationController");

router.get("/pending", getPendingVerifications);

router.patch("/:ashaId/status", updateVerificationStatus);

router.get("/pending-asha-workers", getPendingAshaWorkersCount);

module.exports = router;
