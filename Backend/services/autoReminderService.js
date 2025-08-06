const Reminder = require('../models/reminder');
const VoiceLog = require('../models/voice');
const aiAssistantService = require('./aiAssistantService');

class AutoReminderService {
    
    /**
     * Check if reminders need to be generated for a user and automatically generate them
     * @param {string} userId - User ID
     * @param {number} pregnancyWeek - Current pregnancy week
     * @returns {Promise<Object>} Reminder generation result
     */
    async checkAndGenerateReminders(userId, pregnancyWeek = null) {
        try {
            console.log(`🔄 Checking reminders for user: ${userId}`);
            
            // Get current week dates
            const { currentWeekStart, currentWeekEnd } = this.getCurrentWeekDates();
            
            // Check if reminders already exist for this week
            const existingReminders = await Reminder.findOne({
                userId,
                weekStartDate: { $lte: currentWeekEnd },
                weekEndDate: { $gte: currentWeekStart }
            });

            if (existingReminders) {
                console.log(`✅ Reminders already exist for user ${userId} this week`);
                // Update compliance and return existing
                existingReminders.calculateCompliance();
                await existingReminders.save();
                
                return {
                    generated: false,
                    existing: true,
                    data: existingReminders,
                    message: "Using existing reminders for this week"
                };
            }

            // No reminders exist, generate new ones
            console.log(`🤖 Generating new reminders for user ${userId}`);
            
            // Get recent voice logs for analysis
            const pastWeekStart = new Date();
            pastWeekStart.setDate(pastWeekStart.getDate() - 7);
            
            const voiceLogs = await VoiceLog.find({
                userId,
                createdAt: { $gte: pastWeekStart }
            }).sort({ createdAt: -1 }).limit(10);

            // Prepare voice logs for AI analysis
            const voiceLogsForAI = voiceLogs.map(log => ({
                transcript: log.transcript,
                week: log.week,
                symptoms: log.parsedData?.extractedInfo?.symptoms || [],
                date: log.createdAt.toISOString().split('T')[0],
                mood: log.parsedData?.extractedInfo?.mood,
                concerns: log.parsedData?.extractedInfo?.concerns || []
            }));

            // Generate AI-powered reminders
            let aiReminders = [];
            let basedOnSymptoms = [];
            let basedOnConditions = [];

            try {
                const userProfile = {
                    pregnancy_week: pregnancyWeek || 20,
                    conditions: [],
                    age: null
                };

                const aiResponse = await aiAssistantService.generateReminders(
                    userId,
                    voiceLogsForAI,
                    userProfile
                );

                if (aiResponse.success) {
                    aiReminders = aiResponse.data.reminders;
                    basedOnSymptoms = [...new Set(voiceLogsForAI.flatMap(log => log.symptoms))];
                    basedOnConditions = userProfile.conditions || [];
                }
            } catch (error) {
                console.error('AI reminder generation failed:', error);
                aiReminders = this.getDefaultReminders();
            }

            // Ensure we have exactly 5 reminders
            if (aiReminders.length === 0) {
                aiReminders = this.getDefaultReminders();
            }

            // Create new reminder document
            const newReminders = new Reminder({
                userId,
                weekStartDate: currentWeekStart,
                weekEndDate: currentWeekEnd,
                reminders: aiReminders,
                completionTracking: [],
                basedOnSymptoms,
                basedOnConditions,
                aiGenerated: true
            });

            const savedReminders = await newReminders.save();
            console.log(`✅ Generated ${aiReminders.length} reminders for user ${userId}`);

            return {
                generated: true,
                existing: false,
                data: savedReminders,
                message: "New reminders generated successfully",
                basedOnLogs: voiceLogs.length
            };

        } catch (error) {
            console.error('Auto reminder generation error:', error);
            return {
                generated: false,
                existing: false,
                error: error.message,
                data: {
                    reminders: this.getDefaultReminders(),
                    compliance_percentage: 0
                }
            };
        }
    }

    /**
     * Get current week start and end dates
     * @returns {Object} Week start and end dates
     */
    getCurrentWeekDates() {
        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        currentWeekStart.setHours(0, 0, 0, 0);
        
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // End of week (Saturday)
        currentWeekEnd.setHours(23, 59, 59, 999);

        return { currentWeekStart, currentWeekEnd };
    }

    /**
     * Check if it's a new week for reminder generation
     * @param {Date} lastGenerated - Last reminder generation date
     * @returns {boolean} True if new week
     */
    isNewWeek(lastGenerated) {
        if (!lastGenerated) return true;
        
        const { currentWeekStart } = this.getCurrentWeekDates();
        return lastGenerated < currentWeekStart;
    }

    /**
     * Batch process reminder generation for multiple users
     * @param {Array} userIds - Array of user IDs
     * @returns {Promise<Array>} Results for each user
     */
    async batchGenerateReminders(userIds) {
        const results = [];
        
        for (const userId of userIds) {
            try {
                const result = await this.checkAndGenerateReminders(userId);
                results.push({ userId, ...result });
            } catch (error) {
                results.push({ 
                    userId, 
                    generated: false, 
                    error: error.message 
                });
            }
        }
        
        return results;
    }

    /**
     * Get default fallback reminders
     * @returns {Array} Default reminder array
     */
    getDefaultReminders() {
        return [
            {
                id: 'reminder_1',
                text: 'Take prenatal vitamins with breakfast',
                category: 'medication',
                priority: 'high'
            },
            {
                id: 'reminder_2',
                text: 'Drink 8-10 glasses of water throughout the day',
                category: 'nutrition',
                priority: 'high'
            },
            {
                id: 'reminder_3',
                text: '20-minute gentle walk or prenatal yoga',
                category: 'exercise',
                priority: 'medium'
            },
            {
                id: 'reminder_4',
                text: 'Monitor baby movements and kick counts',
                category: 'monitoring',
                priority: 'medium'
            },
            {
                id: 'reminder_5',
                text: 'Schedule next prenatal checkup appointment',
                category: 'appointment',
                priority: 'medium'
            }
        ];
    }

    /**
     * Schedule automatic reminder generation (to be called by cron job)
     * @returns {Promise<Object>} Batch generation results
     */
    async scheduledReminderGeneration() {
        try {
            console.log('🕒 Starting scheduled reminder generation...');
            
            // Get all active users who might need reminders
            // This would typically query your user database
            // For now, we'll check existing reminder records to find active users
            const activeUsers = await Reminder.distinct('userId');
            
            if (activeUsers.length === 0) {
                console.log('📭 No active users found for reminder generation');
                return { processed: 0, generated: 0, errors: 0 };
            }

            const results = await this.batchGenerateReminders(activeUsers);
            
            const stats = {
                processed: results.length,
                generated: results.filter(r => r.generated).length,
                existing: results.filter(r => r.existing).length,
                errors: results.filter(r => r.error).length
            };

            console.log(`📊 Scheduled generation complete:`, stats);
            return stats;

        } catch (error) {
            console.error('Scheduled reminder generation error:', error);
            return { processed: 0, generated: 0, errors: 1, error: error.message };
        }
    }
}

module.exports = new AutoReminderService();
