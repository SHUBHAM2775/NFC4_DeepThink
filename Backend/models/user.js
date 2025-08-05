const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String, // ⬅️ Add this if you want to store admin name directly
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'asha_worker', 'pregnant_lady'],
    required: true
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'roleRef',
    default: null // Optional: allow null for admins
  },
  roleRef: {
    type: String,
    enum: ['Admin', 'AshaWorker', 'PregnantLady'],
    required: true
  },
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
