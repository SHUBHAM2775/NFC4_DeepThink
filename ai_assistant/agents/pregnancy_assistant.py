import os
import requests
import json
from typing import Optional, Dict, Any

class LocalAIClient:
    """Client for handling different local AI providers with multilingual support"""
    
    def __init__(self):
        self.ollama_available = self._check_ollama()
        self.selected_provider = self._select_provider()
        self.supported_languages = {
            'hindi': 'हिंदी',
            'spanish': 'español', 
            'french': 'français',
            'german': 'deutsch',
            'chinese': '中文',
            'arabic': 'العربية',
            'portuguese': 'português',
            'russian': 'русский',
            'japanese': '日本語',
            'korean': '한국어'
        }
        print(f"✅ Local AI initialized with provider: {self.selected_provider}")
        print(f"🌍 Multilingual support: Available for {len(self.supported_languages)} languages")
    
    def detect_language(self, text: str) -> str:
        """Simple language detection based on script/characters"""
        # Check for Devanagari script (Hindi)
        if any('\u0900' <= char <= '\u097F' for char in text):
            return 'hindi'
        # Check for Arabic script
        elif any('\u0600' <= char <= '\u06FF' for char in text):
            return 'arabic'
        # Check for Chinese characters
        elif any('\u4e00' <= char <= '\u9fff' for char in text):
            return 'chinese'
        # Check for Japanese characters
        elif any('\u3040' <= char <= '\u309F' or '\u30A0' <= char <= '\u30FF' for char in text):
            return 'japanese'
        # Check for Korean characters
        elif any('\uAC00' <= char <= '\uD7AF' for char in text):
            return 'korean'
        else:
            return 'english'  # Default to English
    
    def _check_ollama(self) -> bool:
        """Check if Ollama is running locally"""
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=2)
            return response.status_code == 200
        except:
            return False
    
    def _select_provider(self) -> str:
        """Select the best available AI provider"""
        if self.ollama_available:
            return "ollama"
        else:
            print("⚠️  Ollama not detected. To get full AI capabilities:")
            print("   1. Install Ollama: https://ollama.ai/")
            print("   2. Run: ollama pull llama3.2")
            print("   3. Restart this app")
            print("   Using Mock AI for now...")
            return "mock"  # Fallback to mock responses
    
    def generate_response(self, prompt: str, system_prompt: str = "", context: str = "", user_language: str = None) -> str:
        """Generate AI response using the selected provider with multilingual support"""
        
        # Detect language if not specified
        if not user_language:
            user_language = self.detect_language(prompt)
        
        # Add multilingual context to system prompt
        if user_language != 'english':
            language_name = self.supported_languages.get(user_language, user_language)
            multilingual_system = f"{system_prompt}\n\nIMPORTANT: The user is communicating in {language_name}. Please respond in the same language ({language_name}) to ensure they can understand your guidance. Be culturally sensitive and appropriate for their language/culture."
        else:
            multilingual_system = system_prompt
        
        # Add context if provided
        if context:
            full_prompt = f"CONTEXT (Previous pregnancy logs):\n{context}\n\nCURRENT QUERY: {prompt}"
        else:
            full_prompt = prompt
        
        if self.selected_provider == "ollama":
            return self._ollama_generate(full_prompt, multilingual_system, user_language)
        else:
            return self._mock_generate(full_prompt, multilingual_system, user_language)
    
    def _ollama_generate(self, prompt: str, system_prompt: str, user_language: str = 'english') -> str:
        """Generate response using Ollama with language support"""
        try:
            # Check if Ollama is still running
            test_response = requests.get("http://localhost:11434/api/tags", timeout=2)
            if test_response.status_code != 200:
                print("Ollama not responding, falling back to mock AI")
                return self._mock_generate(prompt, system_prompt, user_language)
            
            # Format the prompt properly for Ollama with language instruction
            if system_prompt:
                full_prompt = f"System: {system_prompt}\n\nUser: {prompt}\n\nAssistant:"
            else:
                full_prompt = prompt
            
            # Make the API call to Ollama
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3.2",  # You can change this to any model you have
                    "prompt": full_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_predict": 200  # Limit response length for faster generation
                    }
                },
                timeout=60  # Increased timeout to 60 seconds
            )
            
            if response.status_code == 200:
                result = response.json().get("response", "").strip()
                if result:
                    return result
                else:
                    print("Empty response from Ollama, using fallback")
                    return self._mock_generate(prompt, system_prompt, user_language)
            else:
                print(f"Ollama API error (status {response.status_code}), using fallback")
                return self._mock_generate(prompt, system_prompt, user_language)
                
        except requests.exceptions.Timeout:
            print("Ollama request timed out, using fallback")
            return self._mock_generate(prompt, system_prompt, user_language)
        except Exception as e:
            print(f"Ollama error: {e}, using fallback")
            return self._mock_generate(prompt, system_prompt, user_language)
    
    def _mock_generate(self, prompt: str, system_prompt: str, user_language: str = 'english') -> str:
        """Generate mock responses based on keywords in the prompt with multilingual support"""
        prompt_lower = prompt.lower()
        
        # Multilingual responses
        responses = {
            'hindi': {
                'first_trimester': "🌟 पहली तिमाही मार्गदर्शन: प्रसवपूर्व विटामिन लें, आराम करें और हाइड्रेटेड रहें। मॉर्निंग सिकनेस सामान्य है - छोटे, बार-बार भोजन लेने की कोशिश करें।",
                'second_trimester': "✨ दूसरी तिमाही - 'सुनहरा समय'! आपकी ऊर्जा वापस आनी चाहिए। यह हल्के व्यायाम, नर्सरी तैयार करने का अच्छा समय है।",
                'third_trimester': "🤱 तीसरी तिमाही: आपका बच्चा तेजी से बढ़ रहा है! बच्चे की हरकतों पर ध्यान दें और अस्पताल का बैग तैयार करें।",
                'anxiety': "गर्भावस्था में चिंता होना बिल्कुल सामान्य है। गहरी सांस लेने के व्यायाम, योग करें। याद रखें, आप बहुत अच्छा कर रही हैं!",
                'default': "आप अपनी गर्भावस्था की यात्रा में बहुत अच्छा कर रही हैं! पानी पीती रहें, प्रसवपूर्व विटामिन लें और किसी भी चिंता के लिए डॉक्टर से संपर्क करें। 💕"
            },
            'english': {
                'first_trimester': "🌟 First trimester guidance: Take prenatal vitamins, rest when needed, and stay hydrated. Morning sickness is common - try eating small, frequent meals. Remember to schedule your first prenatal appointment!",
                'second_trimester': "✨ Second trimester - the 'golden period'! Your energy should return. This is a great time for gentle exercise, preparing the nursery, and enjoying your pregnancy. You might start feeling baby movements soon!",
                'third_trimester': "🤱 Third trimester: Your baby is growing rapidly! Monitor baby movements, practice relaxation techniques, and prepare your hospital bag. Contact your healthcare provider if you notice decreased movement or unusual symptoms.",
                'anxiety': "It's completely normal to feel anxious during pregnancy. Try deep breathing exercises, gentle meditation, or prenatal yoga. Talk to your partner, friends, or a counselor. Remember, you're doing great!",
                'default': "You're doing wonderfully on this pregnancy journey! Remember to take care of yourself, stay hydrated, take your prenatal vitamins, and don't hesitate to contact your healthcare provider with any concerns. Every pregnancy is unique - trust your body and your instincts. 💕"
            }
        }
        
        # Get responses for the detected language, fallback to English
        lang_responses = responses.get(user_language, responses['english'])
        
        # Extract week number if present
        week_num = None
        for i in range(1, 41):
            if f"week {i}" in prompt_lower or f"सप्ताह {i}" in prompt_lower:
                week_num = i
                break
        
        # Week-specific responses
        if week_num:
            if week_num <= 12:
                return lang_responses['first_trimester']
            elif week_num <= 26:
                return lang_responses['second_trimester']
            else:
                return lang_responses['third_trimester']
        
        # Symptom and emotion-specific responses
        if any(word in prompt_lower for word in ['anxious', 'worried', 'stressed', 'चिंतित', 'परेशान']):
            return lang_responses['anxiety']
        
        if any(word in prompt_lower for word in ['back pain', 'कमर दर्द', 'पीठ दर्द']):
            if user_language == 'hindi':
                return "गर्भावस्था में कमर दर्द के लिए: प्रसवपूर्व योग करें, गर्भावस्था तकिया का उपयोग करें, गर्म सिकाई करें और अच्छी मुद्रा बनाए रखें।"
            else:
                return "For back pain during pregnancy: Try prenatal yoga, use a pregnancy pillow while sleeping, apply warm compresses, and consider a maternity support belt. Avoid heavy lifting and maintain good posture."
        
        if any(word in prompt_lower for word in ['nausea', 'morning sickness', 'मतली', 'उल्टी']):
            if user_language == 'hindi':
                return "मतली के लिए: दिन भर में छोटे, बार-बार भोजन लें। अदरक की चाय या अदरक की कैंडी लें। तेज़ गंध और तैलीय भोजन से बचें।"
            else:
                return "For nausea: Eat small, frequent meals throughout the day. Try ginger tea or ginger candy. Avoid strong smells and fatty foods. Stay hydrated and consider vitamin B6 supplements (consult your doctor first)."
        
        # Default response
        return lang_responses['default']

# Initialize the local AI client
client = LocalAIClient()

def create_pregnancy_assistant():
    """
    Creates and returns configuration for the pregnancy health assistant.
    Now uses local AI instead of OpenAI.
    """
    assistant_config = {
        "name": "PregnancyHealthAgent",
        "instructions": """
        You are an empathetic health assistant for pregnant users. Provide weekly guidance, 
        monitor symptoms, and escalate if danger is detected (e.g., heavy bleeding, severe pain).
        Always prioritize user safety and recommend consulting healthcare professionals for 
        serious symptoms.
        """,
        "provider": client.selected_provider,
        "tools": ["symptom_checker", "emergency_escalator"]
    }
    return assistant_config

def get_local_assistant():
    """
    Returns the local AI assistant client
    """
    return client
