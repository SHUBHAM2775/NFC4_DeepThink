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

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length === 2;
        },
        message: "Coordinates must be an array of two numbers",
      },
    },
  },

  createdAt: { type: Date, default: Date.now },
});

pregnantLadySchema.index({ location: "2dsphere" });

pregnantLadySchema.virtual("currentMonthsPregnant").get(function () {
  const now = new Date();
  const createdAt = this.createdAt;

  const diffInMonths =
    (now.getFullYear() - createdAt.getFullYear()) * 12 +
    (now.getMonth() - createdAt.getMonth());

  let updatedMonths = this.monthsPregnant + diffInMonths;

  if (updatedMonths > 9) updatedMonths = 9;

  return updatedMonths;
});

pregnantLadySchema.set("toJSON", { virtuals: true });
pregnantLadySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("PregnantLady", pregnantLadySchema);
