const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  role: {
    type: String,
    enum: ["pregnant_woman", "asha_worker", "admin"],
    required: true,
  },

  ashaIdImage: {
    type: String,
    required: function () {
      return this.role === "asha_worker";
    },
  },

  otp: {
    code: String,
    expiresAt: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
