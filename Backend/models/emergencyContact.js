const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema({
  pregnantLady: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PregnantLady",
    required: true,
  },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EmergencyContact", emergencyContactSchema);
