const mongoose = require('mongoose');

const ashaWorkerSchema = new mongoose.Schema({
  ashaId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  documents: { type: [String], default: [] },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  phc: String,
  village: String,
  district: String,
  state: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AshaWorker', ashaWorkerSchema);
