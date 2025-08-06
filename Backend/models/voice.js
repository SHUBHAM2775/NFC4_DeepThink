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
    // AI-extracted information
    aiGuidance: String,
    extractedInfo: {
      mood: String,
      energy_level: String,
      symptoms: [String],
      sleep_hours: Number,
      water_intake: String,
      exercise: String,
      concerns: [String]
    },
    symptomAnalysis: {
      severity: String,
      recommendations: [String]
    },
    escalation: {
      urgent: Boolean,
      message: String,
      contact_info: String
    },
    aiServiceStatus: {
      type: String,
      enum: ['available', 'fallback', 'error'],
      default: 'available'
    },
    language: String,
    hasMemory: Boolean,
    
    // Legacy fields for backward compatibility
    mood: String,
    symptoms: [String],
    food: [String],
    painLevel: String
  },
  week: {
    type: Number,
    min: 1,
    max: 42
  },
  language: String,
  aiProcessed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VoiceLog', voiceLogSchema);
