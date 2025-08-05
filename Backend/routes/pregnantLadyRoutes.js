const express = require("express");
const router = express.Router();
const {
  getNearbyAshaWorkers,
} = require("../controllers/pregnantLadyController");

router.get("/:pregnantLadyId/nearby-asha-workers", getNearbyAshaWorkers);

module.exports = router;
