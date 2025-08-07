# 🤱 Sakhi Saathi - AI Pregnancy Care Platform

[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-yellow)](https://python.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An AI-powered, multilingual pregnancy care platform designed to bridge healthcare gaps in rural communities through intelligent assistance and local language support.

## Overview

This project addresses critical healthcare challenges faced by pregnant women in rural areas, including language barriers, limited healthcare access, and lack of personalized guidance. The platform leverages local AI processing to ensure complete privacy while providing culturally sensitive, multilingual pregnancy care assistance.

## Key Features

### AI-Powered Healthcare Assistant
- **Local AI Processing**: Utilizes Ollama llama3.2 for complete data privacy
- **Intelligent Memory System**: Maintains comprehensive pregnancy journey records
- **Emergency Detection**: Automated identification and flagging of concerning symptoms

### Multilingual Support
- **Multi-language Interface**: Support for 10+ regional languages including Hindi, Gujarati, and Marathi
- **Voice Recognition**: Native language speech processing capabilities
- **Cultural Adaptation**: Localized health recommendations and advice

### Role-Based Access Control
- **Patient Portal**: Health tracking, AI guidance, and voice logging
- **ASHA Worker Dashboard**: Patient management and emergency alert system
- **Administrative Panel**: System oversight and comprehensive analytics

### Core Functionality
- **Voice-Based Health Logging**: Daily health updates through speech recognition
- **Smart Notification System**: AI-generated personalized reminders and alerts
- **Secure Authentication**: OTP-based phone verification system
- **Document Management**: Health certificate upload and verification

## Technical Architecture

| Component | Technology Stack |
|-----------|------------------|
| **Frontend** | React 19, Vite, Tailwind CSS, i18next |
| **Backend** | Node.js, Express.js, MongoDB |
| **AI Service** | Python, Flask, Ollama (llama3.2) |
| **Authentication** | JWT, OTP verification via Twilio |

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB
- Ollama

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/SHUBHAM2775/NFC4_DeepThink.git
cd NFC4_DeepThink
```

2. **Install Ollama and AI model**
```bash
ollama pull llama3.2
```

3. **Backend configuration**
```bash
cd Backend
npm install
# Configure .env file with MongoDB URI and Twilio credentials
```

4. **Frontend setup**
```bash
cd ../Frontend
npm install
```

5. **AI service setup**
```bash
cd ../ai_assistant
pip install -r requirements.txt
```

### Running the Application

Execute the provided startup script:
```bash
./start-all-services.bat
```

Or start services manually:
```bash
# Start MongoDB
mongod

# Start backend service (Terminal 1)
cd Backend && npm run dev

# Start frontend service (Terminal 2)  
cd Frontend && npm run dev

# Start AI service (Terminal 3)
cd ai_assistant && python app.py
```

Access the application at `http://localhost:5173`

## System Architecture

The platform consists of three main components:
- **React Frontend**: User interface with multilingual support
- **Node.js Backend**: API services and database management
- **Python AI Service**: Local AI processing and natural language understanding

## Screenshots

| Feature | Description |
|---------|-------------|
| Landing Page | Main platform interface |
| AI Assistant | Interactive chat system |
| Voice Logging | Speech-to-text health recording |
| Dashboard | Patient management interface |

## Future Development

- **Mobile Application**: React Native implementation for enhanced accessibility
- **IoT Integration**: Wearable device connectivity for continuous monitoring
- **Telemedicine Features**: Video consultation capabilities
- **Government System Integration**: Connection with national health ministry platforms
- **Blockchain Implementation**: Secure and immutable health record management

## Team

- **Shreya Shuka** - [GitHub](https://github.com/Shreyaa983)
- **Raseeca Kashelkar** - [GitHub](https://github.com/ItsMeRaseeca)
- **Om Mhaske** - [GitHub](https://github.com/om-mhaske7)
- **Shubham Upadhyay** - [GitHub](https://github.com/SHUBHAM2775)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed during Need For Code 4.0 Hackathon - Empowering Rural Healthcare Through Technology**
