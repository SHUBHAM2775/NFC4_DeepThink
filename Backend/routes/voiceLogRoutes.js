const express = require('express');
const router = express.Router();
const { 
  submitVoiceLog, 
  getVoiceLogHistory, 
  getAIGuidance,
  getChatGuidance 
} = require('../controllers/voiceLogController');

router.post('/submit', submitVoiceLog);
router.get('/history/:userId', getVoiceLogHistory);
router.post('/guidance', getAIGuidance);
router.post('/chat', getChatGuidance);

module.exports = router;
