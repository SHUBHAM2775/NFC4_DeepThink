// Test script for AI Assistant integration
const axios = require('axios');

const AI_ASSISTANT_URL = 'http://localhost:5002';

async function testAIAssistant() {
    console.log('🧪 Testing AI Assistant Integration...\n');

    // Test 1: Check if service is available
    try {
        const response = await axios.get(`${AI_ASSISTANT_URL}/guidance/basic?week=20`, {
            timeout: 5000
        });
        console.log('✅ AI Assistant service is available');
        console.log('📊 Basic response:', response.data);
    } catch (error) {
        console.log('❌ AI Assistant service is not available:', error.message);
        return;
    }

    // Test 2: Test voice guidance endpoint
    try {
        const voiceResponse = await axios.post(`${AI_ASSISTANT_URL}/voice-guidance`, {
            user_id: 'test_user_123',
            transcript: 'I have been feeling tired and have some back pain today. I am 25 weeks pregnant.',
            week: 25,
            language: 'english'
        }, {
            timeout: 15000
        });

        console.log('\n✅ Voice guidance test successful!');
        console.log('🤖 AI Guidance:', voiceResponse.data.guidance);
        console.log('📊 Extracted Info:', voiceResponse.data.extracted_info);
        
        if (voiceResponse.data.escalation && voiceResponse.data.escalation.urgent) {
            console.log('⚠️  Urgent Alert:', voiceResponse.data.escalation.message);
        }
    } catch (error) {
        console.log('❌ Voice guidance test failed:', error.message);
        if (error.response) {
            console.log('Error details:', error.response.data);
        }
    }

    // Test 3: Test regular guidance endpoint
    try {
        const guidanceResponse = await axios.post(`${AI_ASSISTANT_URL}/guidance`, {
            user_id: 'test_user_123',
            week: 25,
            daily_log: {
                mood: 'tired',
                energy_level: 'low',
                symptoms: ['back pain', 'fatigue'],
                sleep_hours: 6,
                water_intake: '4 glasses',
                exercise: 'none',
                concerns: ['back pain getting worse']
            },
            user_profile: {
                age: 28,
                first_pregnancy: true
            }
        }, {
            timeout: 15000
        });

        console.log('\n✅ Regular guidance test successful!');
        console.log('🤖 AI Guidance:', guidanceResponse.data.guidance);
        console.log('🧠 Has Memory:', guidanceResponse.data.has_memory);
        console.log('🌍 Language:', guidanceResponse.data.language);
    } catch (error) {
        console.log('❌ Regular guidance test failed:', error.message);
    }

    console.log('\n🎉 AI Assistant integration test completed!');
}

// Run the test
testAIAssistant().catch(console.error);
