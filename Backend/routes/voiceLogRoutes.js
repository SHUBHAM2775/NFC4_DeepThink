const express = require('express');
const router = express.Router();
const { submitVoiceLog } = require('../controllers/voiceLogController');

router.post('/submit', submitVoiceLog);

module.exports = router;
