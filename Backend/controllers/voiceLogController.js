const VoiceLog = require('../models/voice');

// POST /api/voice/submit
const submitVoiceLog = async (req, res) => {
  try {
    const { transcript, userId } = req.body;

    if (!transcript || !userId) {
      return res.status(400).json({ msg: "Transcript and userId are required" });
    }

    const voiceLog = new VoiceLog({
      userId,
      transcript,
      parsedData: {}, // We'll enhance this later with actual parsing logic
    });

    const savedLog = await voiceLog.save();

    res.status(201).json({
      msg: "Voice log submitted successfully",
      data: savedLog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  submitVoiceLog,
};
