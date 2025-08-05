const express = require("express");
const router = express.Router();

const {
  getPendingVerifications,
  updateVerificationStatus,
} = require("../controllers/verificationController");

router.get("/pending", getPendingVerifications);

router.patch("/:ashaId/status", updateVerificationStatus);

module.exports = router;
