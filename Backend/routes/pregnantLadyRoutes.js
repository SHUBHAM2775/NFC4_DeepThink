const express = require("express");
const router = express.Router();
const {
  getNearbyAshaWorkers,
  assignAshaWorker,
  getPregnantLadyName,
} = require("../controllers/pregnantLadyController");

router.get("/:pregnantLadyId/nearby-asha-workers", getNearbyAshaWorkers);

router.post("/assigned", assignAshaWorker);

router.get("/:pregnantLadyId/name", getPregnantLadyName);

module.exports = router;
