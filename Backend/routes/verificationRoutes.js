const express = require("express");
const router = express.Router();

const {
  getPendingVerifications,
} = require("../controllers/verificationController");

router.get("/pending", getPendingVerifications);

module.exports = router;
