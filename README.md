# 🤱 DeepThink - AI Pregnancy Care Platform

[![Need For Code 4.0](https://img.shields.io/badge/Need%20For%20Code-4.0-orange)](https://hackathon.com)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-yellow)](https://python.org/)

> **🏆 Built for Need For Code 4.0 Hackathon - An AI-powered, multilingual pregnancy care platform bridging healthcare gaps in rural communities.**

## 🌟 Problem Statement

Rural pregnant women face language barriers, limited healthcare access, and lack of personalized guidance. Our solution addresses these challenges through AI-powered, multilingual pregnancy assistance.

## ✨ Key Features

### 🤖 **Smart AI Assistant**
- **Local AI (Ollama llama3.2)** - Complete privacy, no data sent to external servers
- **Memory System** - Remembers entire pregnancy journey for personalized advice
- **Emergency Detection** - Automatic flagging of concerning symptoms

### 🌍 **Multilingual Support** 
- **10+ Languages** including Hindi, Gujarati, Marathi
- **Voice Recognition** - Speak in your native language
- **Cultural Sensitivity** - Localized health advice

### 👥 **Multi-Role Platform**
- **Pregnant Women** - Daily health tracking, AI guidance, voice logs
- **ASHA Workers** - Patient management, emergency alerts
- **Admins** - System oversight and analytics

### 📱 **Core Features**
- **Voice Logging** - Record daily health updates using speech
- **Smart Reminders** - AI-generated personalized notifications  
- **OTP Authentication** - Secure phone-based login
- **Document Upload** - Health certificate verification

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS, i18next |
| **Backend** | Node.js, Express, MongoDB, Twilio |
| **AI Service** | Python, Flask, Ollama (llama3.2) |
| **Auth** | JWT, OTP verification |

## 🚀 Quick Start

### Prerequisites
- Node.js 16+, Python 3.8+, MongoDB, Ollama

### Installation & Setup
```bash
# Clone repository
git clone https://github.com/SHUBHAM2775/NFC4_DeepThink.git
cd NFC4_DeepThink

# Install Ollama and model
ollama pull llama3.2

# Setup Backend
cd Backend
npm install
# Create .env with MongoDB, Twilio credentials

# Setup Frontend  
cd ../Frontend
npm install

# Setup AI Assistant
cd ../ai_assistant
pip install -r requirements.txt
```

### Run Application
```bash
# Start all services (use provided script)
./start-all-services.bat

# Or manually:
# Terminal 1: mongod
# Terminal 2: cd Backend && npm run dev  
# Terminal 3: cd Frontend && npm run dev
# Terminal 4: cd ai_assistant && python app.py
```

**Access**: Frontend at `http://localhost:5173`

## 🎯 Hackathon Innovation

### 💡 **What Makes It Special**
- **First-of-its-kind**: Local AI for pregnancy care with complete privacy
- **Rural-focused**: Voice-first interface for low-literacy users
- **Multilingual AI**: Native language health guidance  
- **Memory-driven**: AI remembers and learns from pregnancy journey
- **Real-world Impact**: Designed for actual ASHA worker workflows

### 🏆 **Technical Achievements**
- Integrated 3 tech stacks seamlessly (React, Node.js, Python)
- Built custom multilingual AI memory system
- Implemented voice recognition in multiple languages
- Created emergency escalation algorithm
- Developed role-based authentication system

## 📱 Demo Features

1. **Multi-role Login** - Patient/ASHA/Admin dashboards
2. **Voice Logging** - Record pregnancy symptoms via speech
3. **AI Chat** - Get personalized advice in your language  
4. **Emergency Alerts** - Automatic risk detection
5. **Document Upload** - Health certificate verification

## 🎬 Screenshots

*[Add your screenshots here after capturing them]*

| Feature | Screenshot |
|---------|------------|
| Landing Page | `![Landing](screenshots/landing-page.png)` |
| AI Assistant | `![AI Chat](screenshots/ai-assistant.png)` |
| Voice Logging | `![Voice](screenshots/voice-logging.png)` |
| Dashboard | `![Dashboard](screenshots/patient-dashboard.png)` |

## 🔮 Future Scope

- **Mobile App**: React Native implementation
- **IoT Integration**: Wearable device connectivity  
- **Telemedicine**: Video consultation features
- **Government Integration**: Connect with health ministry systems
- **Blockchain**: Secure health record management

## 👥 Team

**Built with ❤️ during Need For Code 4.0 Hackathon**

- **Developer**: [Shubham Upadhyay](https://github.com/SHUBHAM2775)
- **Stack**: Full-stack + AI integration
- **Timeline**: 48 hours hackathon build

## 📞 Contact

- **GitHub**: [@SHUBHAM2775](https://github.com/SHUBHAM2775)
- **Repository**: [NFC4_DeepThink](https://github.com/SHUBHAM2775/NFC4_DeepThink)

---

**🏆 Need For Code 4.0 Submission - Empowering Rural Pregnancy Care Through AI** 🚀
