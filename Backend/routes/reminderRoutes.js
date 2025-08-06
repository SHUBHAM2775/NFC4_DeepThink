const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const auth = require('../middlewares/authmiddleware');

// POST /api/reminders/generate - Generate weekly reminders using AI (AUTO-GENERATION)
router.post('/generate', reminderController.generateWeeklyReminders);

// GET /api/reminders/:userId - Get current week's reminders (AUTO-CHECKS & GENERATES)
router.get('/:userId', reminderController.getCurrentReminders);

// POST /api/reminders/complete - Mark reminder as complete/incomplete
router.post('/complete', reminderController.markReminderComplete);

// GET /api/reminders/history/:userId - Get reminder history
router.get('/history/:userId', reminderController.getReminderHistory);

// GET /api/reminders/cron/generate - Scheduled/manual reminder generation for all users
router.get('/cron/generate', reminderController.scheduledReminderGeneration);

module.exports = router;
