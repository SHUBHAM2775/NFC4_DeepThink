const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "asha_worker", "pregnant_lady"],
    required: true,
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "roleRef",
  },
  roleRef: {
    type: String,
    required: true,
    enum: ["Admin", "AshaWorker", "PregnantLady"],
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
