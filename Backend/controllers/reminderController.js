const Reminder = require('../models/reminder');
const VoiceLog = require('../models/voice');
const autoReminderService = require('../services/autoReminderService');

// POST /api/reminders/generate - AUTO-GENERATE weekly reminders using AI
const generateWeeklyReminders = async (req, res) => {
  try {
    const { userId, pregnancyWeek } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    // Use automatic reminder service (checks if exists, generates if needed)
    const result = await autoReminderService.checkAndGenerateReminders(userId, pregnancyWeek);

    if (result.error) {
      return res.status(500).json({
        msg: "Failed to process reminders",
        error: result.error,
        data: result.data
      });
    }

    const statusCode = result.generated ? 201 : 200;
    const message = result.generated ? "New reminders generated automatically" : "Using existing reminders for this week";

    res.status(statusCode).json({
      msg: message,
      data: result.data,
      compliance_percentage: result.data.compliancePercentage || 0,
      week_status: result.data.getCurrentWeekStatus ? result.data.getCurrentWeekStatus() : { active: true },
      auto_generated: result.generated,
      based_on_logs: result.basedOnLogs || 0
    });

  } catch (err) {
    console.error('Auto-generate reminders error:', err);
    res.status(500).json({ 
      msg: "Server error", 
      error: err.message,
      data: {
        reminders: autoReminderService.getDefaultReminders(),
        compliance_percentage: 0
      }
    });
  }
};

// GET /api/reminders/:userId - Auto-check and get current reminders
const getCurrentReminders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    // Auto-check and generate reminders if needed
    const result = await autoReminderService.checkAndGenerateReminders(userId);

    if (result.error) {
      return res.status(500).json({
        msg: "Failed to get reminders",
        error: result.error,
        data: { reminders: [], compliance_percentage: 0 }
      });
    }

    res.status(200).json({
      msg: result.generated ? "New reminders auto-generated" : "Current reminders retrieved",
      data: result.data,
      compliance_percentage: result.data.compliancePercentage || 0,
      week_status: result.data.getCurrentWeekStatus ? result.data.getCurrentWeekStatus() : { active: true },
      auto_generated_this_call: result.generated
    });

  } catch (err) {
    console.error('Get reminders error:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// POST /api/reminders/complete
const markReminderComplete = async (req, res) => {
  try {
    const { userId, reminderId, completed = true } = req.body;

    if (!userId || !reminderId) {
      return res.status(400).json({ msg: "userId and reminderId are required" });
    }

    // Get current week's reminders
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);

    const reminders = await Reminder.findOne({
      userId,
      weekStartDate: { $lte: currentWeekEnd },
      weekEndDate: { $gte: currentWeekStart }
    });

    if (!reminders) {
      return res.status(404).json({ msg: "No reminders found for this week" });
    }

    // Check if completion already exists for today
    const todayString = today.toISOString().split('T')[0];
    const existingCompletion = reminders.completionTracking.find(
      track => track.reminderId === reminderId && 
               track.date.toISOString().split('T')[0] === todayString
    );

    if (existingCompletion) {
      // Update existing completion
      existingCompletion.completed = completed;
      existingCompletion.completedAt = completed ? new Date() : null;
    } else {
      // Add new completion
      reminders.completionTracking.push({
        reminderId,
        date: today,
        completed,
        completedAt: completed ? new Date() : null
      });
    }

    // Recalculate compliance
    reminders.calculateCompliance();
    reminders.updatedAt = new Date();

    const savedReminders = await reminders.save();

    res.status(200).json({
      msg: `Reminder marked as ${completed ? 'completed' : 'incomplete'}`,
      data: savedReminders,
      compliance_percentage: savedReminders.compliancePercentage,
      today_completion: reminders.completionTracking.filter(
        track => track.date.toISOString().split('T')[0] === todayString && track.completed
      ).length
    });

  } catch (err) {
    console.error('Mark reminder complete error:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET /api/reminders/history/:userId
const getReminderHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { weeks = 4 } = req.query;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    // Get past reminders
    const weeksAgo = new Date();
    weeksAgo.setDate(weeksAgo.getDate() - (parseInt(weeks) * 7));

    const reminderHistory = await Reminder.find({
      userId,
      weekStartDate: { $gte: weeksAgo }
    }).sort({ weekStartDate: -1 });

    // Calculate summary statistics
    const totalWeeks = reminderHistory.length;
    const averageCompliance = totalWeeks > 0 
      ? Math.round(reminderHistory.reduce((sum, r) => sum + r.compliancePercentage, 0) / totalWeeks)
      : 0;

    res.status(200).json({
      msg: "Reminder history retrieved successfully",
      data: reminderHistory,
      summary: {
        total_weeks: totalWeeks,
        average_compliance: averageCompliance,
        weeks_requested: parseInt(weeks)
      }
    });

  } catch (err) {
    console.error('Get reminder history error:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET /api/reminders/cron/generate - Scheduled reminder generation endpoint
const scheduledReminderGeneration = async (req, res) => {
  try {
    console.log('🕒 Manual trigger of scheduled reminder generation');
    
    const result = await autoReminderService.scheduledReminderGeneration();
    
    res.status(200).json({
      msg: "Scheduled reminder generation completed",
      stats: result
    });

  } catch (err) {
    console.error('Scheduled generation error:', err);
    res.status(500).json({ msg: "Scheduled generation failed", error: err.message });
  }
};

module.exports = {
  generateWeeklyReminders,
  getCurrentReminders,
  markReminderComplete,
  getReminderHistory,
  scheduledReminderGeneration
};
