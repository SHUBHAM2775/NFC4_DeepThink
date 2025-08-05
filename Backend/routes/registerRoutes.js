const express = require("express");
const router = express.Router();

const { registerAdmin, registerAshaWorker,registerPregnantLady  } = require("../controllers/registrationController");

router.post("/admin", registerAdmin);           
router.post("/asha", registerAshaWorker);  
router.post("/lady", registerPregnantLady);     

module.exports = router;
