const mongoose = require('mongoose');

const voiceLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  transcript: {
    type: String,
    required: true,
  },
  parsedData: {
    mood: String,
    symptoms: [String],
    food: [String],
    painLevel: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VoiceLog', voiceLogSchema);
