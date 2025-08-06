const axios = require('axios');

const AI_ASSISTANT_URL = 'http://localhost:5002';

class AIAssistantService {
    constructor() {
        this.baseURL = AI_ASSISTANT_URL;
    }

    /**
     * Process voice transcript and get AI-powered pregnancy guidance
     * @param {string} transcript - The voice transcript
     * @param {string} userId - User ID for memory tracking
     * @param {string} language - Optional language preference
     * @param {number} week - Optional pregnancy week
     * @returns {Promise<Object>} AI guidance response
     */
    async getVoiceGuidance(transcript, userId, language = null, week = null) {
        try {
            const response = await axios.post(`${this.baseURL}/voice-guidance`, {
                user_id: userId,
                transcript: transcript,
                language: language,
                week: week
            }, {
                timeout: 30000 // Increase to 30 seconds for AI processing
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('AI Assistant Service Error:', error.message);
            
            // Return fallback response if AI service is unavailable
            return {
                success: false,
                error: error.message,
                fallback: true,
                data: {
                    guidance: "Thank you for sharing your daily update. Please continue with regular prenatal care and consult your healthcare provider if you have any concerns.",
                    source: "fallback",
                    transcript: transcript
                }
            };
        }
    }

    /**
     * Get structured pregnancy guidance
     * @param {Object} dailyLog - Daily log data
     * @param {string} userId - User ID
     * @param {number} week - Pregnancy week
     * @param {Object} userProfile - User profile data
     * @param {string} language - Language preference
     * @returns {Promise<Object>} AI guidance response
     */
    async getPregnancyGuidance(dailyLog, userId, week, userProfile = {}, language = null) {
        try {
            const response = await axios.post(`${this.baseURL}/guidance`, {
                user_id: userId,
                week: week,
                daily_log: dailyLog,
                user_profile: userProfile,
                language: language
            }, {
                timeout: 30000 // Increase timeout for AI processing
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('AI Guidance Service Error:', error.message);
            
            return {
                success: false,
                error: error.message,
                fallback: true,
                data: {
                    guidance: `Week ${week}: Continue with regular prenatal care, stay hydrated, and get adequate rest. Contact your healthcare provider with any concerns.`,
                    source: "fallback",
                    week: week
                }
            };
        }
    }

    /**
     * Monitor symptoms for potential escalation
     * @param {Array} symptoms - Array of symptoms
     * @returns {Promise<Object>} Symptom analysis and escalation recommendations
     */
    async monitorSymptoms(symptoms) {
        try {
            const response = await axios.post(`${this.baseURL}/monitor`, {
                symptoms: symptoms
            }, {
                timeout: 5000
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Symptom Monitoring Service Error:', error.message);
            
            return {
                success: false,
                error: error.message,
                fallback: true,
                data: {
                    check: { severity: "unknown", recommendations: ["Please consult your healthcare provider"] },
                    escalation: { urgent: false, message: "Unable to analyze symptoms at this time" }
                }
            };
        }
    }

    /**
     * Generate personalized weekly reminders using AI analysis
     * @param {string} userId - User ID for personalization
     * @param {Array} voiceLogs - Recent voice logs for analysis
     * @param {Object} userProfile - User profile data
     * @returns {Promise<Object>} AI-generated reminders
     */
    async generateReminders(userId, voiceLogs, userProfile) {
        try {
            const response = await axios.post(`${this.baseURL}/generate-reminders`, {
                user_id: userId,
                voice_logs: voiceLogs,
                user_profile: userProfile
            }, {
                timeout: 30000, // 30 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('AI Reminder Generation Error:', error.message);
            return {
                success: false,
                error: error.message,
                data: {
                    reminders: this.getDefaultReminders()
                }
            };
        }
    }

    /**
     * Get chat response from AI Assistant
     * @param {string} message - User's chat message
     * @param {string} userId - User ID for memory tracking
     * @param {string} language - Optional language preference
     * @returns {Promise<Object>} AI chat response
     */
    async getChatResponse(message, userId, language = null) {
        try {
            const response = await axios.post(`${this.baseURL}/chat`, {
                user_id: userId,
                message: message,
                language: language
            }, {
                timeout: 30000 // 30 seconds timeout for AI response
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('AI Chat Service Error:', error.message);
            
            // Return fallback response if AI service is unavailable
            return {
                success: false,
                error: error.message,
                fallback: true,
                data: {
                    guidance: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again later or contact your healthcare provider if you have urgent concerns.",
                    source: "fallback",
                    message: message
                }
            };
        }
    }

    /**
     * Check if AI Assistant service is available
     * @returns {Promise<boolean>} True if service is available
     */
    async isServiceAvailable() {
        try {
            const response = await axios.get(`${this.baseURL}/guidance/basic?week=20`, {
                timeout: 3000
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
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
                icon: '💊',
                priority: 'high'
            },
            {
                id: 'reminder_2',
                text: 'Drink 8-10 glasses of water throughout the day',
                category: 'nutrition',
                icon: '💧',
                priority: 'high'
            },
            {
                id: 'reminder_3',
                text: '20-minute gentle walk or prenatal yoga',
                category: 'exercise',
                icon: '🧘‍♀️',
                priority: 'medium'
            },
            {
                id: 'reminder_4',
                text: 'Monitor baby movements and kick counts',
                category: 'monitoring',
                icon: '👶',
                priority: 'medium'
            },
            {
                id: 'reminder_5',
                text: 'Schedule next prenatal checkup appointment',
                category: 'appointment',
                icon: '👩‍⚕️',
                priority: 'medium'
            }
        ];
    }
}

module.exports = new AIAssistantService();
