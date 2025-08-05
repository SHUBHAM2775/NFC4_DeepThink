const mongoose = require('mongoose');

const voiceLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PregnantLady', 
    required: true
  },
  transcript: {
    type: String,
    required: true
  },
  parsedData: {
    mood: String,
    symptoms: String,
    foodIntake: String,
    pain: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VoiceLog', voiceLogSchema);
