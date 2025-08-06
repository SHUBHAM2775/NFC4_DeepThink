const express = require("express");
const router = express.Router();
const {
  getNearbyAshaWorkers,
  assignAshaWorker,
  getPregnantLadyName,
  getEmergencyContact,
} = require("../controllers/pregnantLadyController");

router.get("/:pregnantLadyId/nearby-asha-workers", getNearbyAshaWorkers);

router.post("/assigned", assignAshaWorker);

router.get("/:pregnantLadyId/name", getPregnantLadyName);

router.get("/:pregnantLadyId/emergency-contacts", getEmergencyContact);

module.exports = router;
