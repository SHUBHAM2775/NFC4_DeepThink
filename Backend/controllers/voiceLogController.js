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

// GET /api/voice/logs/user/:userId - Get past voice logs with date filtering
const getPastLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // Handle demo data - if userId starts with "demo_patient_", return empty array
    if (userId.startsWith('demo_patient_')) {
      return res.status(200).json({
        success: true,
        count: 0,
        logs: [],
        msg: "Demo data - no historical logs available"
      });
    }

    // Build query - handle both string and ObjectId formats
    let query = {};
    
    // Try to create ObjectId, but also search by string if it fails
    try {
      const mongoose = require('mongoose');
      const objectId = new mongoose.Types.ObjectId(userId);
      query = { 
        $or: [
          { userId: objectId },
          { userId: userId }
        ]
      };
    } catch (e) {
      // If ObjectId conversion fails, search by string
      query = { userId: userId };
    }

    // Add date filtering if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    console.log('Searching for logs with query:', query);

    // Fetch logs sorted by creation date (newest first)
    const logs = await VoiceLog.find(query)
      .sort({ createdAt: -1 })
      .limit(100); // Limit to prevent too much data

    console.log(`Found ${logs.length} logs for user ${userId}`);

    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });

  } catch (error) {
    console.error('Error fetching past logs:', error);
    res.status(500).json({ 
      success: false,
      msg: "Server error while fetching past logs",
      error: error.message 
    });
  }
};

// POST /api/voice/create-sample-logs/:userId - Create sample logs for testing
const createSampleLogs = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // Convert userId to ObjectId if it's a valid ObjectId string
    let userObjectId;
    try {
      const mongoose = require('mongoose');
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (e) {
      userObjectId = userId; // Keep as string if conversion fails
    }

    // Sample voice logs data
    const sampleLogs = [
      {
        userId: userObjectId,
        transcript: "I'm feeling good today. Had a good night's sleep and feeling energetic. Baby is moving well. I drank plenty of water and took my prenatal vitamins.",
        parsedData: {
          aiGuidance: "Great to hear you're feeling well! Continue with your current routine of staying hydrated and taking prenatal vitamins. The baby's movement is a positive sign.",
          extractedInfo: {
            mood: "good",
            energy_level: "high",
            symptoms: [],
            sleep_hours: 8,
            water_intake: "plenty",
            exercise: "none",
            concerns: []
          },
          symptomAnalysis: {
            severity: "none",
            recommendations: ["Continue current routine", "Keep monitoring baby movements"]
          },
          escalation: {
            urgent: false,
            message: "",
            contact_info: ""
          },
          aiServiceStatus: "available",
          language: "en",
          hasMemory: true
        },
        week: 28,
        language: "en",
        aiProcessed: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userId: userObjectId,
        transcript: "I'm having some mild nausea today and feeling tired. The baby hasn't moved as much as usual. I'm a bit worried.",
        parsedData: {
          aiGuidance: "Mild nausea can be normal, but reduced baby movement needs attention. Please monitor movements for the next hour and contact your healthcare provider if movement doesn't increase.",
          extractedInfo: {
            mood: "worried",
            energy_level: "low",
            symptoms: ["nausea", "fatigue"],
            sleep_hours: 6,
            water_intake: "normal",
            exercise: "none",
            concerns: ["reduced baby movement"]
          },
          symptomAnalysis: {
            severity: "moderate",
            recommendations: ["Monitor baby movements", "Contact healthcare provider if movements don't increase", "Stay hydrated"]
          },
          escalation: {
            urgent: false,
            message: "Reduced baby movement - monitor closely",
            contact_info: "Contact healthcare provider if no improvement"
          },
          aiServiceStatus: "available",
          language: "en",
          hasMemory: true
        },
        week: 29,
        language: "en",
        aiProcessed: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        userId: userObjectId,
        transcript: "Severe headache and vision problems. Feel dizzy and nauseous. Very worried about the baby.",
        parsedData: {
          aiGuidance: "URGENT: These symptoms could indicate preeclampsia or other serious conditions. Please contact your healthcare provider immediately or go to the emergency room.",
          extractedInfo: {
            mood: "very worried",
            energy_level: "very low",
            symptoms: ["severe headache", "vision problems", "dizziness", "nausea"],
            sleep_hours: 4,
            water_intake: "low",
            exercise: "none",
            concerns: ["severe symptoms", "baby safety"]
          },
          symptomAnalysis: {
            severity: "high",
            recommendations: ["IMMEDIATE medical attention required", "Go to emergency room", "Do not delay treatment"]
          },
          escalation: {
            urgent: true,
            message: "Severe symptoms indicating possible preeclampsia - IMMEDIATE medical attention required",
            contact_info: "Emergency: 108, Hospital: +91 12345 67890"
          },
          aiServiceStatus: "available",
          language: "en",
          hasMemory: true
        },
        week: 29,
        language: "en",
        aiProcessed: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        userId: userObjectId,
        transcript: "Feeling much better today. Headache is gone. Baby is moving normally. Had a check-up and everything looks good.",
        parsedData: {
          aiGuidance: "Excellent news! It's great that your symptoms have resolved and the check-up went well. Continue monitoring your health and baby's movements.",
          extractedInfo: {
            mood: "relieved",
            energy_level: "good",
            symptoms: [],
            sleep_hours: 7,
            water_intake: "good",
            exercise: "light walking",
            concerns: []
          },
          symptomAnalysis: {
            severity: "none",
            recommendations: ["Continue current care", "Keep regular check-ups", "Monitor symptoms"]
          },
          escalation: {
            urgent: false,
            message: "",
            contact_info: ""
          },
          aiServiceStatus: "available",
          language: "en",
          hasMemory: true
        },
        week: 29,
        language: "en",
        aiProcessed: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    // First, remove any existing sample logs for this user to avoid duplicates
    await VoiceLog.deleteMany({ 
      userId: { $in: [userObjectId, userId] },
      transcript: { $in: sampleLogs.map(log => log.transcript) }
    });

    // Insert sample logs
    const createdLogs = await VoiceLog.insertMany(sampleLogs);

    res.status(201).json({
      success: true,
      msg: `Created ${createdLogs.length} sample voice logs`,
      count: createdLogs.length,
      logs: createdLogs
    });

  } catch (error) {
    console.error('Error creating sample logs:', error);
    res.status(500).json({ 
      success: false,
      msg: "Server error while creating sample logs",
      error: error.message 
    });
  }
};

// POST /api/voice/create-test-user - Create a test user and sample logs
const createTestUser = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Create a test user ID
    const testUserId = new mongoose.Types.ObjectId();
    
    // Create sample logs for this test user
    const sampleLogs = [
      {
        userId: testUserId,
        transcript: "Good morning! I'm feeling great today. Baby is very active and I slept well. Taking my vitamins regularly.",
        parsedData: {
          aiGuidance: "Wonderful to hear you're feeling great! Active baby movements and good sleep are excellent signs. Keep up with your vitamin routine.",
          extractedInfo: {
            mood: "excellent",
            energy_level: "high",
            symptoms: [],
            sleep_hours: 8,
            water_intake: "good",
            exercise: "light",
            concerns: []
          },
          symptomAnalysis: {
            severity: "none",
            recommendations: ["Continue current routine", "Keep monitoring baby movements"]
          },
          escalation: {
            urgent: false,
            message: "",
            contact_info: ""
          },
          aiServiceStatus: "available",
          language: "en",
          hasMemory: true
        },
        week: 32,
        language: "en",
        aiProcessed: true,
        createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        userId: testUserId,
        transcript: "Having some back pain today and feeling tired. Baby movements seem normal though. Drank water and rested.",
        parsedData: {
          aiGuidance: "Back pain is common in later pregnancy. Since baby movements are normal, this sounds like typical pregnancy discomfort. Continue resting and staying hydrated.",
          extractedInfo: {
            mood: "tired",
            energy_level: "low",
            symptoms: ["back pain", "fatigue"],
            sleep_hours: 6,
            water_intake: "adequate",
            exercise: "none",
            concerns: []
          },
          symptomAnalysis: {
            severity: "mild",
            recommendations: ["Rest when possible", "Use pregnancy pillow", "Gentle stretching", "Monitor if pain worsens"]
          },
          escalation: {
            urgent: false,
            message: "",
            contact_info: ""
          },
          aiServiceStatus: "available",
          language: "en",
          hasMemory: true
        },
        week: 32,
        language: "en",
        aiProcessed: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    // Insert the sample logs
    const createdLogs = await VoiceLog.insertMany(sampleLogs);

    res.status(201).json({
      success: true,
      testUserId: testUserId.toString(),
      msg: `Created test user with ID: ${testUserId} and ${createdLogs.length} sample voice logs`,
      logs: createdLogs
    });

  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ 
      success: false,
      msg: "Server error while creating test user",
      error: error.message 
    });
  }
};

module.exports = {
  submitVoiceLog,
  getVoiceLogHistory,
  getAIGuidance,
  getChatGuidance,
  getPastLogs,
  createSampleLogs,
  createTestUser
};
