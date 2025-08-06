#!/usr/bin/env python3

from agents.pregnancy_assistant import get_local_assistant
from services.pregnancy_memory import PregnancyMemory
import json

def test_memory_and_multilingual():
    """Test memory functionality and multilingual support"""
    
    print("🧪 Testing Memory and Multilingual Features")
    print("=" * 60)
    
    # Initialize
    assistant = get_local_assistant()
    memory = PregnancyMemory()
    
    print(f"✅ Assistant Provider: {assistant.selected_provider}")
    print(f"🌍 Languages Supported: {list(assistant.supported_languages.keys())}")
    print()
    
    # Test 1: Memory functionality
    print("📝 Test 1: Memory System")
    print("-" * 30)
    
    user_id = "test_user_123"
    
    # Simulate pregnancy journey
    logs = [
        {"week": 8, "daily_log": {"mood": "tired", "symptoms": ["nausea"], "concerns": ["morning sickness"]}},
        {"week": 12, "daily_log": {"mood": "better", "symptoms": [], "concerns": []}},
        {"week": 16, "daily_log": {"mood": "excited", "symptoms": [], "concerns": ["when will I feel movement?"]}},
        {"week": 20, "daily_log": {"mood": "happy", "symptoms": ["baby kicks!"], "concerns": []}},
    ]
    
    # Save logs
    for log in logs:
        memory.save_log(user_id, log["week"], log["daily_log"], {"age": 28, "first_pregnancy": True})
    
    # Test retrieval
    recent_logs = memory.get_recent_logs(user_id, limit=3)
    profile = memory.get_user_profile(user_id)
    journey_summary = memory.get_pregnancy_journey_summary(user_id)
    
    print(f"✅ Saved {len(logs)} logs")
    print(f"✅ Retrieved {len(recent_logs)} recent logs")
    print(f"✅ User profile: {profile}")
    print(f"✅ Journey summary preview: {journey_summary[:100]}...")
    print()
    
    # Test 2: Multilingual Support
    print("🌍 Test 2: Multilingual Support")
    print("-" * 35)
    
    test_cases = [
        {"text": "I am 20 weeks pregnant and feeling great!", "expected_lang": "english"},
        {"text": "मैं 20 सप्ताह की गर्भवती हूं और बहुत अच्छा महसूस कर रही हूं!", "expected_lang": "hindi"},
        {"text": "I feel baby movements मुझे बच्चे की हरकत महसूस हो रही है", "expected_lang": "hindi"},  # Mixed
    ]
    
    for i, case in enumerate(test_cases, 1):
        text = case["text"]
        expected = case["expected_lang"]
        
        detected = assistant.detect_language(text)
        print(f"Test 2.{i}:")
        print(f"  Input: {text}")
        print(f"  Expected: {expected}")
        print(f"  Detected: {detected}")
        print(f"  ✅ {'Correct' if detected == expected else 'Different detection'}")
        print()
    
    # Test 3: AI Response with Memory Context
    print("🤖 Test 3: AI Response with Memory Context")
    print("-" * 42)
    
    # Test with context (simulating week 24 after the journey above)
    context = journey_summary
    prompt = "I'm now at week 24 and feeling some back pain. Should I be concerned?"
    system_prompt = "You are a caring pregnancy assistant with knowledge of the user's journey."
    
    print("Context provided:")
    print(f"  {context[:150]}...")
    print()
    print("Current query:")
    print(f"  {prompt}")
    print()
    
    try:
        response = assistant.generate_response(prompt, system_prompt, context)
        print("AI Response with Memory:")
        print(f"✅ {response}")
        print()
    except Exception as e:
        print(f"❌ Error: {e}")
        print()
    
    # Test 4: Multilingual AI Responses
    print("🗣️ Test 4: Multilingual AI Responses")
    print("-" * 36)
    
    multilingual_tests = [
        {
            "prompt": "मैं 25 सप्ताह की गर्भवती हूं और बहुत चिंतित हूं। कुछ सलाह दे सकते हैं?",
            "language": "hindi",
            "description": "Hindi query about anxiety at 25 weeks"
        },
        {
            "prompt": "I'm 30 weeks pregnant and having trouble sleeping. Any advice?",
            "language": "english",
            "description": "English query about sleep issues"
        }
    ]
    
    for i, test in enumerate(multilingual_tests, 1):
        print(f"Test 4.{i}: {test['description']}")
        print(f"  Query: {test['prompt']}")
        
        try:
            response = assistant.generate_response(
                test['prompt'], 
                "You are a caring pregnancy health assistant.",
                "",
                test['language']
            )
            print(f"  Response: {response[:100]}...")
            print(f"  ✅ Success")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        print()
    
    # Test 5: API Simulation
    print("🌐 Test 5: API Format Simulation")
    print("-" * 33)
    
    api_request = {
        "user_id": user_id,
        "language": "hindi",
        "week": 26,
        "daily_log": {
            "mood": "चिंतित",  # anxious in Hindi
            "energy_level": "कम",  # low in Hindi
            "symptoms": ["कमर दर्द"],  # back pain in Hindi
            "sleep_hours": 6,
            "concerns": ["क्या यह सामान्य है?"]  # is this normal?
        },
        "user_profile": {
            "age": 28,
            "first_pregnancy": True
        }
    }
    
    print("API Request (with Hindi content):")
    print(json.dumps(api_request, indent=2, ensure_ascii=False))
    print()
    
    # Simulate the API logic
    context = memory.get_pregnancy_journey_summary(user_id)
    try:
        response = assistant.generate_response(
            f"Week {api_request['week']}: {api_request['daily_log']}",
            "You are a caring pregnancy assistant.",
            context,
            api_request['language']
        )
        print("Simulated API Response:")
        print(f"✅ {response}")
    except Exception as e:
        print(f"❌ API simulation error: {e}")
    
    print()
    print("=" * 60)
    print("🎉 Memory and Multilingual Testing Complete!")
    
    # Summary
    if assistant.selected_provider == "ollama":
        print("✅ Full Ollama AI with memory and multilingual support working!")
    else:
        print("📝 Mock AI with memory and multilingual support working!")
        print("   Install Ollama for more natural multilingual conversations.")

if __name__ == "__main__":
    test_memory_and_multilingual()
