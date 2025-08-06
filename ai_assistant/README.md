# 🤱 Local AI Pregnancy Assistant

A **privacy-first** pregnancy health assistant with **memory** and **multilingual support** that runs completely on your machine - no API keys, no cloud services, no data sharing!

## ✨ Key Features

✅ **Completely Private** - All AI runs on your machine  
✅ **Remembers Your Journey** - Context-aware responses based on pregnancy history  
✅ **Multilingual Support** - Works in 10+ languages including Hindi  
✅ **No API Keys** - No external services required  
✅ **Works Offline** - No internet needed after setup  
✅ **Smart Fallbacks** - Always works, even without AI models  
✅ **Pregnancy-Focused** - Specialized knowledge and empathetic responses  
✅ **Symptom Monitoring** - Built-in health checks with emergency escalation  

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up Ollama
1. Download Ollama: https://ollama.ai/
2. Install and let it start automatically
3. Download a model:
   ```bash
   ollama pull llama3.2
   ```

### 3. Start the App
```bash
python app.py
```

### 4. Test Everything
```bash
python test_memory_multilingual.py
```

**Expected Output**: Should show "ollama" as provider with multilingual support active! 🎉

## 📡 API Endpoints

### `POST /guidance` - Smart Pregnancy Guidance
Get personalized, context-aware guidance with memory.

```json
{
  "user_id": "user123",
  "language": "hindi",
  "week": 24,
  "daily_log": {
    "mood": "खुश",
    "energy_level": "अच्छी", 
    "symptoms": ["बच्चे की लात!"],
    "sleep_hours": 7,
    "concerns": ["क्या यह सामान्य है?"]
  },
  "user_profile": {
    "age": 28,
    "first_pregnancy": true
  }
}
```

### `GET /history/{user_id}` - View Pregnancy Journey
See complete pregnancy log history.

### `POST /test/multilingual` - Test Language Support
Test multilingual capabilities with any text.

### `POST /monitor` - Symptom Monitoring
Health monitoring with emergency escalation.

## 🌍 Multilingual Support

**Supported Languages:**
- **English** - Full support
- **Hindi (हिंदी)** - Full support  
- **Spanish** - Basic support
- **French** - Basic support
- **German** - Basic support
- **Chinese (中文)** - Basic support
- **Arabic (العربية)** - Basic support
- **Portuguese** - Basic support
- **Russian** - Basic support
- **Japanese (日本語)** - Basic support
- **Korean (한국어)** - Basic support

The AI automatically detects language and responds appropriately!

## 🧠 Memory System

The assistant remembers:
- **Previous symptoms** and how they've changed
- **Mood patterns** throughout pregnancy
- **Concerns** you've had and how they were resolved
- **Progress milestones** (first kicks, energy changes, etc.)
- **Your pregnancy profile** and preferences

This enables **truly personalized** guidance that improves over time!

## 🔧 Current Setup

Your assistant automatically uses:
1. **Ollama** (if available) - Full conversational AI with memory
2. **Mock AI** (fallback) - Smart responses with memory support

## 📊 Example Conversations

**English:**
- "I'm 20 weeks pregnant and feeling the baby kick for the first time!"
- Response: Personalized guidance considering your journey history

**Hindi:**
- "मैं 25 सप्ताह की गर्भवती हूं और चिंतित हूं।"
- Response: "आपकी चिंता समझ आती है। 25 सप्ताह में..." (in Hindi)

## 🛠️ Project Structure

```
assistant/
├── app.py                           # Flask API server
├── agents/
│   └── pregnancy_assistant.py       # Local AI with multilingual support
├── services/
│   ├── pregnancy_memory.py          # Memory system
│   ├── symptom_checker.py           # Health monitoring
│   └── emergency_escalator.py       # Safety checks
├── pregnancy_data/                  # User data storage (auto-created)
├── test_memory_multilingual.py     # Comprehensive test suite
└── requirements.txt                 # Dependencies
```

## 💡 What Makes This Special

### Before (Traditional AI Assistants):
- Need internet connection
- No memory between conversations  
- English-only
- Data sent to external servers
- Expensive API costs

### Now (Your Local Assistant):
- **100% Private** - Everything on your machine
- **Remembers everything** - Full pregnancy journey context
- **Speaks your language** - 10+ languages supported
- **Always available** - Works offline
- **Completely free** - No ongoing costs

## 🎯 Perfect For:

- **Privacy-conscious parents** who want to keep health data private
- **Non-English speakers** who need native language support
- **Offline environments** where internet isn't reliable  
- **Cost-conscious users** who don't want subscription fees
- **Long-term tracking** - the AI gets smarter about your pregnancy over time

## 🚀 Ready for Frontend Integration

All endpoints are ready for your React/Vue.js/mobile app:
- RESTful JSON APIs
- Comprehensive error handling
- Multilingual response support
- Memory-enabled context
- Real-time health monitoring

---

**Built with ❤️ for expectant parents who value privacy, personalization, and multilingual support.**

*Your pregnancy journey is unique - now your AI assistant is too!* 🤱✨
