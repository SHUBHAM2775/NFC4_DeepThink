const VoiceLog = require('../models/voice');

exports.submitVoiceLog = async (req, res) => {
  try {
    const { transcript, userId } = req.body;

    if (!transcript || !userId) {
      return res.status(400).json({ error: 'Transcript and userId are required' });
    }

    const newLog = await VoiceLog.create({
      userId,
      transcript,
      parsedData: {}, // You can fill this later by parsing the speech
    });

    res.status(201).json({
      message: 'Voice log saved successfully',
      log: newLog
    });
  } catch (error) {
    console.error('Error saving voice log:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
