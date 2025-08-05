const express = require("express");
const router = express.Router();
const {
  getHighRiskPregnantLadiesCount,
  getAshaWorkerName,
} = require("../controllers/ashaWorkerController");

router.get("/pregnant-ladies/high-risk/count", getHighRiskPregnantLadiesCount);

router.get("/:ashaId/name", getAshaWorkerName);

module.exports = router;
