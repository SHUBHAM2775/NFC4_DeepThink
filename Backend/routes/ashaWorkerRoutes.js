const express = require("express");
const router = express.Router();
const {
  getHighRiskPregnantLadiesCount,
} = require("../controllers/ashaWorkerController");

router.get("/pregnant-ladies/high-risk/count", getHighRiskPregnantLadiesCount);

module.exports = router;
