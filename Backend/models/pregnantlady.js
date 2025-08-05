const mongoose = require("mongoose");

const answerEnum = ["yes", "no", "not sure"];

const pregnantLadySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  village: String,
  district: String,
  state: String,

  currentlyPregnant: { type: String, enum: answerEnum, required: true },
  firstPregnancy: { type: String, enum: answerEnum, required: true },
  visitedDoctorOrASHA: { type: String, enum: answerEnum, required: true },
  monthsPregnant: { type: Number, min: 1, max: 9, required: true },
  knownHealthIssues: { type: String, enum: answerEnum, required: true },
  recentSymptoms: { type: String, enum: answerEnum, required: true },
  takingSupplements: { type: String, enum: answerEnum, required: true },
  hasMobileInEmergency: { type: String, enum: answerEnum, required: true },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PregnantLady", pregnantLadySchema);
