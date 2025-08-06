const express = require("express");
const router = express.Router();
const {
  getNearbyAshaWorkers,
  assignAshaWorker,
  getPregnantLadyName,
  getEmergencyContacts,
  addEmergencyContact,
  emergencyLaborCall,
  assignPatientToAshaWorker,
  getPatientsForAshaWorker,
} = require("../controllers/pregnantLadyController");

router.get("/:pregnantLadyId/nearby-asha-workers", getNearbyAshaWorkers);

router.post("/assigned", assignAshaWorker);

router.get("/:pregnantLadyId/name", getPregnantLadyName);

router.get("/:pregnantLadyId/emergency-contacts", getEmergencyContacts);

router.post("/:pregnantLadyId/emergency-contacts", addEmergencyContact);

router.get("/:pregnantLadyId/emergency-call", emergencyLaborCall);

router.post("/assign-to-asha", assignPatientToAshaWorker);
router.get("/asha/:ashaWorkerId/patients", getPatientsForAshaWorker);

module.exports = router;
