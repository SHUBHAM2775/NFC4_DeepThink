const VoiceLog = require('../models/voice');
const aiAssistantService = require('../services/aiAssistantService');

// POST /api/voice/submit
const submitVoiceLog = async (req, res) => {
  try {
    const { transcript, userId, week, language } = req.body;

    if (!transcript || !userId) {
      return res.status(400).json({ msg: "Transcript and userId are required" });
    }

    // Get AI-powered guidance for the voice log
    const aiResponse = await aiAssistantService.getVoiceGuidance(
      transcript, 
      userId, 
      language, 
      week
    );

    // Prepare parsed data including AI guidance
    const parsedData = {
      aiGuidance: aiResponse.data.guidance,
      extractedInfo: aiResponse.data.extracted_info || {},
      symptomAnalysis: aiResponse.data.symptom_analysis || {},
      escalation: aiResponse.data.escalation || {},
      aiServiceStatus: aiResponse.success ? 'available' : 'fallback',
      language: aiResponse.data.language || 'auto-detected',
      hasMemory: aiResponse.data.has_memory || false
    };

    // Save voice log with AI analysis
    const voiceLog = new VoiceLog({
      userId,
      transcript,
      parsedData,
      week: week || null,
      language: language || null,
      aiProcessed: aiResponse.success
    });

    const savedLog = await voiceLog.save();

    res.status(201).json({
      msg: "Voice log submitted successfully",
      data: savedLog,
      aiGuidance: aiResponse.data.guidance,
      aiServiceAvailable: aiResponse.success,
      extractedInfo: aiResponse.data.extracted_info,
      escalation: aiResponse.data.escalation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET /api/voice/history/:userId
const getVoiceLogHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    const voiceLogs = await VoiceLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      msg: "Voice log history retrieved successfully",
      data: voiceLogs,
      count: voiceLogs.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// POST /api/voice/guidance
const getAIGuidance = async (req, res) => {
  try {
    const { dailyLog, userId, week, userProfile, language } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    // Get AI-powered pregnancy guidance
    const aiResponse = await aiAssistantService.getPregnancyGuidance(
      dailyLog || {},
      userId,
      week || 20,
      userProfile || {},
      language
    );

    res.status(200).json({
      msg: "AI guidance retrieved successfully",
      guidance: aiResponse.data.guidance,
      week: aiResponse.data.week,
      aiServiceAvailable: aiResponse.success,
      source: aiResponse.data.source,
      language: aiResponse.data.language,
      hasMemory: aiResponse.data.has_memory || false
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// POST /api/voice/chat
const getChatGuidance = async (req, res) => {
  try {
    const { message, userId, language } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ msg: "Message and userId are required" });
    }

    // Get AI-powered chat response
    const aiResponse = await aiAssistantService.getChatResponse(
      message, 
      userId, 
      language
    );

    res.status(200).json({
      msg: "Chat guidance retrieved successfully",
      aiGuidance: aiResponse.data.guidance,
      aiServiceAvailable: aiResponse.success,
      source: aiResponse.data.source,
      language: aiResponse.data.language,
      hasMemory: aiResponse.data.has_memory || false
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      msg: "Server error", 
      error: err.message,
      aiGuidance: "I apologize, but I'm having trouble connecting right now. Please try again later.",
      aiServiceAvailable: false
    });
  }
};

module.exports = {
  submitVoiceLog,
  getVoiceLogHistory,
  getAIGuidance,
  getChatGuidance
};
