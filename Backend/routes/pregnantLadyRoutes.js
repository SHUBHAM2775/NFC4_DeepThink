const express = require("express");
const router = express.Router();
const {
  getNearbyAshaWorkers,
  assignAshaWorker,
} = require("../controllers/pregnantLadyController");

router.get("/:pregnantLadyId/nearby-asha-workers", getNearbyAshaWorkers);

router.post("/assigned", assignAshaWorker);

module.exports = router;
