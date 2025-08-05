const express = require("express");
const router = express.Router();

const { registerAdmin } = require("../controllers/registrationController");
console.log("✅ registerRoutes loaded");
router.post("/admin", registerAdmin);

router.get("/test", (req, res) => {
  res.send("Register route working!");
});

module.exports = router;
