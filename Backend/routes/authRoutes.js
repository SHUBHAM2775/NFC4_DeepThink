const express = require("express");
const router = express.Router();

const {
  requestOtp,
  verifyOtp,
  getTotalNonAdminUserCount,
} = require("../controllers/authController");

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.get("/total-count", getTotalNonAdminUserCount);

module.exports = router;
