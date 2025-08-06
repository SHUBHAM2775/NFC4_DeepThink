from flask import Flask, request, jsonify
from agents.pregnancy_assistant import create_pregnancy_assistant, get_local_assistant
from services.symptom_checker import check_symptoms
from services.emergency_escalator import escalate
from services.pregnancy_memory import PregnancyMemory

app = Flask(__name__)
assistant_config = create_pregnancy_assistant()
local_ai = get_local_assistant()
memory = PregnancyMemory()  # Initialize memory system

@app.route('/monitor', methods=['POST'])
def monitor():
    data = request.get_json()
    symptoms = data.get('symptoms', [])

    check = check_symptoms(symptoms)
    escalate_result = escalate(check)

    return jsonify({
        "check": check,
        "escalation": escalate_result
    })

@app.route('/guidance', methods=['POST'])
def guidance():
    """
    Enhanced guidance endpoint with memory and multilingual support.
    
    Expected JSON input:
    {
        "user_id": "user123",  # NEW: For memory tracking
        "language": "hindi",   # NEW: Optional language preference
        "week": 24,
        "daily_log": {
            "mood": "anxious",
            "energy_level": "low", 
            "symptoms": ["back pain", "nausea"],
            "sleep_hours": 6,
            "water_intake": "3 glasses",
            "exercise": "30 min walk",
            "concerns": ["baby movement seems less today"]
        },
        "user_profile": {
            "age": 28,
            "first_pregnancy": true,
            "health_conditions": ["gestational diabetes"]
        }
    }
    """
    try:
        data = request.get_json()
        week = data.get('week', 20)
        daily_log = data.get('daily_log', {})
        user_profile = data.get('user_profile', {})
        user_id = data.get('user_id', 'anonymous')  # Default user ID
        language = data.get('language', None)  # Auto-detect if not specified
        
        # Save current log to memory
        memory.save_log(user_id, week, daily_log, user_profile)
        
        # Get context from previous logs
        context = memory.get_pregnancy_journey_summary(user_id)
        
        # Generate personalized guidance with memory and language support
        guidance_text = generate_ai_guidance_with_memory(week, daily_log, user_profile, context, language)
        
        return jsonify({
            "week": week,
            "guidance": guidance_text,
            "source": f"AI-powered ({local_ai.selected_provider})",
            "personalized": True,
            "has_memory": len(memory.get_recent_logs(user_id)) > 1,
            "language": local_ai.detect_language(guidance_text) if language else "auto-detected"
        })
            
    except Exception as e:
        return jsonify({
            "error": "Failed to generate guidance",
            "message": str(e)
        }), 500

def generate_ai_guidance_with_memory(week, daily_log, user_profile, context, language=None):
    """Generate personalized guidance using local AI with memory context and language support"""
    
    # Construct a detailed prompt with memory context
    system_prompt = "You are an empathetic pregnancy health assistant providing personalized guidance. Use the context from previous logs to provide continuity and track progress."
    
    prompt = f"""
    A user at week {week} of pregnancy has shared their daily log.
    
    User Profile:
    - Age: {user_profile.get('age', 'not specified')}
    - First pregnancy: {user_profile.get('first_pregnancy', 'not specified')}
    - Health conditions: {user_profile.get('health_conditions', 'none specified')}
    
    {context}
    
    Today's Log (Week {week}):
    - Mood: {daily_log.get('mood', 'not specified')}
    - Energy level: {daily_log.get('energy_level', 'not specified')}
    - Symptoms: {daily_log.get('symptoms', 'none reported')}
    - Sleep hours: {daily_log.get('sleep_hours', 'not specified')}
    - Water intake: {daily_log.get('water_intake', 'not specified')}
    - Exercise: {daily_log.get('exercise', 'not specified')}
    - Concerns: {daily_log.get('concerns', 'none specified')}
    
    Please provide:
    1. Personalized guidance considering their pregnancy journey history
    2. Address any concerns and note any changes from previous weeks
    3. Specific actionable advice for today/this week
    4. When to contact their healthcare provider (if applicable)  
    5. Positive encouragement noting their progress
    
    Keep the response caring, informative, and under 200 words.
    """
    
    try:
        return local_ai.generate_response(prompt, system_prompt, context, language)
        
    except Exception as e:
        print(f"AI guidance error: {e}")
        return generate_fallback_guidance(week, daily_log)

def generate_ai_guidance(week, daily_log, user_profile):
    """Generate personalized guidance using local AI based on user's daily log"""
    
    # Construct a detailed prompt for the AI
    system_prompt = "You are an empathetic pregnancy health assistant providing personalized guidance."
    
    prompt = f"""
    A user at week {week} of pregnancy has shared their daily log.
    
    User Profile:
    - Age: {user_profile.get('age', 'not specified')}
    - First pregnancy: {user_profile.get('first_pregnancy', 'not specified')}
    - Health conditions: {user_profile.get('health_conditions', 'none specified')}
    
    Today's Log:
    - Mood: {daily_log.get('mood', 'not specified')}
    - Energy level: {daily_log.get('energy_level', 'not specified')}
    - Symptoms: {daily_log.get('symptoms', 'none reported')}
    - Sleep hours: {daily_log.get('sleep_hours', 'not specified')}
    - Water intake: {daily_log.get('water_intake', 'not specified')}
    - Exercise: {daily_log.get('exercise', 'not specified')}
    - Concerns: {daily_log.get('concerns', 'none specified')}
    
    Please provide:
    1. Personalized guidance based on their current week and daily log
    2. Address any concerns they mentioned
    3. Specific actionable advice for today/this week
    4. When to contact their healthcare provider (if applicable)
    5. Positive encouragement
    
    Keep the response caring, informative, and under 200 words.
    """
    
    try:
        return local_ai.generate_response(prompt, system_prompt)
        
    except Exception as e:
        print(f"Local AI error: {e}")
        return generate_fallback_guidance(week, daily_log)

def generate_fallback_guidance(week, daily_log):
    """Generate rule-based guidance when OpenAI is not available"""
    
    guidance_parts = []
    
    # Week-specific advice
    week_advice = {
        range(1, 13): "First trimester: Focus on taking prenatal vitamins and managing morning sickness.",
        range(13, 27): "Second trimester: Great time for exercise and preparing the nursery!",
        range(27, 41): "Third trimester: Monitor baby movements and prepare for delivery."
    }
    
    for week_range, advice in week_advice.items():
        if week in week_range:
            guidance_parts.append(advice)
            break
    
    # Address specific symptoms or concerns
    symptoms = daily_log.get('symptoms', [])
    if 'back pain' in str(symptoms).lower():
        guidance_parts.append("For back pain, try prenatal yoga or a warm bath.")
    
    if 'nausea' in str(symptoms).lower():
        guidance_parts.append("For nausea, try eating small frequent meals and ginger tea.")
    
    # Sleep advice
    sleep_hours = daily_log.get('sleep_hours')
    if isinstance(sleep_hours, (int, float)) and sleep_hours < 7:
        guidance_parts.append("Try to get 7-9 hours of sleep. Consider a pregnancy pillow for comfort.")
    
    # Water intake
    water = daily_log.get('water_intake', '')
    if 'glass' in str(water).lower():
        try:
            glasses = int(''.join(filter(str.isdigit, str(water))))
            if glasses < 8:
                guidance_parts.append("Aim for 8-10 glasses of water daily to stay hydrated.")
        except:
            pass
    
    # Mood support
    mood = daily_log.get('mood', '').lower()
    if mood in ['anxious', 'worried', 'stressed']:
        guidance_parts.append("It's normal to feel anxious. Try deep breathing exercises or talk to your healthcare provider.")
    
    # Default advice if no specific guidance generated
    if not guidance_parts:
        guidance_parts.append("Continue with regular prenatal care and listen to your body.")
    
    return " ".join(guidance_parts)

@app.route('/voice-guidance', methods=['POST'])
def voice_guidance():
    """
    Process voice logs and provide AI-powered pregnancy guidance.
    
    Expected JSON input:
    {
        "user_id": "user123",
        "transcript": "I've been feeling nauseous and tired today",
        "language": "hindi",  # Optional
        "week": 24           # Optional
    }
    """
    try:
        data = request.get_json()
        transcript = data.get('transcript', '')
        user_id = data.get('user_id', 'anonymous')
        language = data.get('language', None)
        week = data.get('week', 20)
        
        if not transcript:
            return jsonify({
                "error": "Transcript is required",
                "message": "Please provide a voice transcript"
            }), 400
        
        # Extract daily log information from transcript using AI
        daily_log = extract_daily_log_from_transcript(transcript)
        
        # Get context from previous logs
        context = memory.get_pregnancy_journey_summary(user_id)
        
        # Save the extracted log to memory
        memory.save_log(user_id, week, daily_log, {})
        
        # Generate AI-powered guidance
        guidance_text = generate_ai_guidance_with_memory(week, daily_log, {}, context, language)
        
        # Check for any concerning symptoms
        symptoms = daily_log.get('symptoms', [])
        symptom_check = check_symptoms(symptoms) if symptoms else {"severity": "normal", "recommendations": []}
        escalation = escalate(symptom_check)
        
        return jsonify({
            "user_id": user_id,
            "transcript": transcript,
            "extracted_info": daily_log,
            "guidance": guidance_text,
            "symptom_analysis": symptom_check,
            "escalation": escalation,
            "language": local_ai.detect_language(guidance_text) if language else "auto-detected",
            "has_memory": len(memory.get_recent_logs(user_id)) > 1
        })
        
    except Exception as e:
        return jsonify({
            "error": "Failed to process voice guidance",
            "message": str(e)
        }), 500

def extract_daily_log_from_transcript(transcript):
    """Extract structured daily log information from voice transcript using AI"""
    system_prompt = """Extract structured information from this pregnancy voice log transcript. 
    Return a JSON-like structure with mood, energy_level, symptoms, sleep_hours, water_intake, exercise, and concerns.
    Be precise and only extract information that is clearly mentioned."""
    
    extraction_prompt = f"""
    Please analyze this voice transcript from a pregnant woman and extract the following information:
    
    Transcript: "{transcript}"
    
    Extract and structure this information:
    - mood: (happy, anxious, tired, excited, worried, etc.)
    - energy_level: (high, medium, low)
    - symptoms: (array of mentioned symptoms like nausea, back pain, headache, etc.)
    - sleep_hours: (number if mentioned)
    - water_intake: (description if mentioned)
    - exercise: (description if mentioned)
    - concerns: (array of specific worries or questions mentioned)
    
    Only include information that is clearly stated. Use "not mentioned" for missing information.
    """
    
    try:
        response = local_ai.generate_response(extraction_prompt, system_prompt)
        # For now, return a basic structure with the transcript as concern
        return {
            "mood": "not specified",
            "energy_level": "not specified",
            "symptoms": [],
            "sleep_hours": None,
            "water_intake": "not specified",
            "exercise": "not specified",
            "concerns": [transcript]
        }
    except Exception as e:
        return {
            "mood": "not specified",
            "energy_level": "not specified", 
            "symptoms": [],
            "sleep_hours": None,
            "water_intake": "not specified",
            "exercise": "not specified",
            "concerns": [transcript],
            "extraction_error": str(e)
        }

@app.route('/guidance/basic', methods=['GET'])
def basic_guidance():
    """Simple GET endpoint for basic guidance without daily logs"""
    week = request.args.get('week', '22')
    return jsonify({
        "week": week,
        "guidance": f"Week {week}: Stay hydrated, take prenatal vitamins, and get adequate rest. Contact your healthcare provider with any concerns.",
        "source": "basic",
        "note": "For personalized guidance, use POST /guidance with daily logs"
    })

@app.route('/history/<user_id>', methods=['GET'])
def get_pregnancy_history(user_id):
    """Get pregnancy history for a user"""
    try:
        logs = memory.get_recent_logs(user_id, limit=10)
        profile = memory.get_user_profile(user_id)
        
        return jsonify({
            "user_id": user_id,
            "user_profile": profile,
            "logs": logs,
            "total_logs": len(logs)
        })
    except Exception as e:
        return jsonify({
            "error": "Failed to retrieve history",
            "message": str(e)
        }), 500

@app.route('/chat', methods=['POST'])
def chat():
    """
    Chat endpoint for conversational AI assistant.
    
    Expected JSON input:
    {
        "user_id": "user123",
        "message": "I'm feeling nauseous today, is this normal?",
        "language": "hindi"  # Optional
    }
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'anonymous')
        message = data.get('message', '')
        language = data.get('language', None)
        
        if not message.strip():
            return jsonify({
                "error": "Message is required",
                "guidance": "Please provide a message to get assistance."
            }), 400
        
        # Get user's pregnancy context from memory
        context = memory.get_pregnancy_journey_summary(user_id)
        recent_logs = memory.get_recent_logs(user_id, limit=3)
        
        # Generate contextual chat response
        guidance_text = generate_chat_response(message, context, recent_logs, language)
        
        return jsonify({
            "guidance": guidance_text,
            "source": f"AI-powered ({local_ai.selected_provider})",
            "has_memory": len(recent_logs) > 0,
            "language": local_ai.detect_language(guidance_text) if language else "auto-detected",
            "user_id": user_id
        })
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({
            "error": "Failed to generate chat response",
            "guidance": "I apologize, but I'm having trouble processing your message right now. Please try again or contact your healthcare provider if you have urgent concerns.",
            "message": str(e)
        }), 500

def generate_chat_response(message, context, recent_logs, language=None):
    """Generate contextual chat response using AI with pregnancy context"""
    
    system_prompt = """You are a caring and knowledgeable pregnancy health assistant. 
    Provide helpful, empathetic responses to pregnancy-related questions. 
    Always prioritize safety and recommend consulting healthcare providers for medical concerns.
    Keep responses concise but informative."""
    
    # Build context from user's pregnancy journey
    context_info = ""
    if context and context.strip():
        context_info = f"\nUser's pregnancy context: {context}"
    
    if recent_logs:
        context_info += "\nRecent activity: "
        for log in recent_logs[-2:]:  # Last 2 logs
            week = log.get('week', 'Unknown')
            mood = log.get('daily_log', {}).get('mood', 'not specified')
            symptoms = log.get('daily_log', {}).get('symptoms', [])
            context_info += f"Week {week} - Mood: {mood}, Symptoms: {', '.join(symptoms) if symptoms else 'none'}. "
    
    full_prompt = f"""
    {context_info}
    
    User's question: {message}
    
    Please provide a helpful, empathetic response. If this seems like a medical concern, 
    recommend consulting a healthcare provider. Keep the response under 150 words.
    """
    
    try:
        # Generate AI response with context
        response = local_ai.generate_response(
            prompt=full_prompt,
            system_prompt=system_prompt,
            context="",
            user_language=language
        )
        
        return response.strip()
        
    except Exception as e:
        print(f"AI generation error: {str(e)}")
        # Fallback response
        return "I'm here to help with your pregnancy questions. While I can provide general guidance, please consult your healthcare provider for personalized medical advice."

@app.route('/test/multilingual', methods=['POST'])
def test_multilingual():
    """Test endpoint for multilingual support"""
    try:
        data = request.get_json()
        text = data.get('text', 'Hello, I am 20 weeks pregnant')
        
        # Detect language
        detected_lang = local_ai.detect_language(text)
        
        # Generate response
        system_prompt = "You are a caring pregnancy health assistant."
        response = local_ai.generate_response(text, system_prompt, "", detected_lang)
        
        return jsonify({
            "input_text": text,
            "detected_language": detected_lang,
            "response": response,
            "supported_languages": list(local_ai.supported_languages.keys())
        })
        
    except Exception as e:
        return jsonify({
            "error": "Multilingual test failed",
            "message": str(e)
        }), 500
    
if __name__ == '__main__':
    print("🏥 Pregnancy Health Assistant API")
    print("📱 Ready to help expectant mothers with personalized guidance")
    print("🌍 Multilingual support: Available for 10+ languages")
    print("🧠 AI Memory: Tracks your pregnancy journey across sessions")
    print()
    
    # Display available endpoints
    print("Available endpoints:")
    print("  POST /monitor - Symptom monitoring and escalation")
    print("  POST /guidance - AI-powered pregnancy guidance with memory")
    print("  POST /voice-guidance - Process voice logs and provide AI guidance")
    print("  POST /chat - Conversational AI assistant for pregnancy questions")
    print()
    
    # Start the server on port 5002 to avoid conflict with Node.js backend
    print("Starting server on http://localhost:5002")
    app.run(debug=True, host='0.0.0.0', port=5002)
