const express = require('express');
const router = express.Router();
const { 
  submitVoiceLog, 
  getVoiceLogHistory, 
  getAIGuidance,
  getChatGuidance,
  getPastLogs,
  createSampleLogs,
  createTestUser
} = require('../controllers/voiceLogController');

router.post('/submit', submitVoiceLog);
router.get('/history/:userId', getVoiceLogHistory);
router.get('/logs/user/:userId', getPastLogs);
router.post('/create-sample-logs/:userId', createSampleLogs);
router.post('/create-test-user', createTestUser);
router.post('/guidance', getAIGuidance);
router.post('/chat', getChatGuidance);

module.exports = router;
