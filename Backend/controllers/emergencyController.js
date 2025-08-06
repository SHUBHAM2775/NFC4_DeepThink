const EmergencyContact = require("../models/emergencyController");

const getEmergencyContacts = async (req, res) => {
  try {
    const { pregnantLadyId } = req.params;

    const contacts = await EmergencyContact.find({
      pregnantLady: pregnantLadyId,
    });

    return res.json({ contacts });
  } catch (err) {
    console.error("Error fetching emergency contacts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getEmergencyContacts,
};
