const express = require("express");
const authRoutes = require("./authRoutes");
const voiceLogRoutes = require("./voiceLogRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/voice", voiceLogRoutes);

module.exports = router;
