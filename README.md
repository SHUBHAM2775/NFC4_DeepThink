# 🤱 DeepThink Pregnancy Care Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.1.0-blue)](https://reactjs.org/)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)](https://python.org/)

> **An AI-powered, multilingual pregnancy care platform designed to bridge healthcare gaps in rural and underserved communities through technology.**

## 🌟 Overview

DeepThink is a comprehensive pregnancy healthcare platform that combines modern web technologies with AI-powered assistance to provide personalized, multilingual pregnancy guidance. Built for hackathon NFC4, this platform addresses critical healthcare accessibility challenges by offering a complete ecosystem for pregnant women, ASHA workers, and healthcare administrators.

## ✨ Key Features

### 🤖 **AI-Powered Pregnancy Assistant**
- **Local AI Integration**: Powered by Ollama (llama3.2) for complete privacy
- **Intelligent Memory System**: Tracks entire pregnancy journey for context-aware responses
- **Smart Health Monitoring**: Automated symptom tracking with emergency escalation
- **Personalized Guidance**: Week-specific advice tailored to individual pregnancy progress

### 🌍 **Multilingual Support**
- **10+ Languages**: English, Hindi, Gujarati, Marathi, Spanish, French, German, Chinese, Arabic, Portuguese, Russian, Japanese, Korean
- **Auto Language Detection**: Automatically detects and responds in user's preferred language
- **Cultural Sensitivity**: Localized advice considering cultural contexts

### 👥 **Multi-Role Platform**
- **Pregnant Women/Families**: Comprehensive pregnancy tracking and guidance
- **ASHA Workers**: Tools for community health worker management
- **Healthcare Administrators**: System oversight and analytics dashboard

### 📱 **Advanced Features**
- **Voice Logging**: Speech-to-text pregnancy log entries
- **Real-time Reminders**: AI-powered personalized reminder system
- **Emergency Escalation**: Automatic flagging of concerning symptoms
- **Geolocation Services**: Location-based healthcare resource mapping
- **Document Management**: Secure storage and verification of health documents

## 🏗️ Architecture

### 📁 Project Structure
```
NFC4_DeepThink/
├── 📱 Frontend/                 # React + Vite frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Admin_Panel/     # Admin dashboard components
│   │   │   ├── ASHA_worker/     # ASHA worker interface
│   │   │   ├── Patient/         # Patient dashboard components
│   │   │   └── VoiceLog/        # Voice recording components
│   │   ├── auth/                # Authentication components
│   │   ├── services/            # API service integrations
│   │   ├── locales/             # Internationalization files
│   │   └── i18n/                # Language configuration
│   └── public/                  # Static assets
│
├── 🚀 Backend/                  # Node.js + Express API server
│   ├── controllers/             # Request handling logic
│   ├── models/                  # MongoDB data models
│   ├── routes/                  # API endpoint definitions
│   ├── services/                # Business logic services
│   ├── middlewares/             # Authentication & validation
│   ├── uploads/                 # File storage system
│   └── utils/                   # Utility functions
│
├── 🤖 ai_assistant/             # Python AI assistant service
│   ├── agents/                  # AI agent implementations
│   ├── services/                # Core AI services
│   │   ├── pregnancy_memory.py  # Memory management system
│   │   ├── symptom_checker.py   # Health monitoring
│   │   └── emergency_escalator.py # Emergency response
│   └── pregnancy_data/          # User data storage
│
└── 📚 Documentation/            # Project documentation
```

### 🛠️ Technology Stack

#### Frontend
- **React 19.1.0** - Modern UI library with latest features
- **Vite 7.0.4** - Lightning-fast build tool
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **React Speech Recognition** - Voice input functionality
- **i18next** - Comprehensive internationalization
- **Axios** - HTTP client for API communication

#### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express 5.1.0** - Web application framework
- **MongoDB + Mongoose** - NoSQL database with ODM
- **Twilio** - SMS and voice communication services
- **JWT** - Secure authentication tokens
- **Multer** - File upload handling

#### AI Assistant
- **Python 3.8+** - AI service runtime
- **Flask 2.3.3** - Lightweight web framework
- **Ollama + llama3.2** - Local large language model
- **Custom Memory System** - Pregnancy journey tracking
- **Multilingual NLP** - Language detection and processing

#### DevOps & Tools
- **Git** - Version control
- **ESLint** - Code quality enforcement
- **Nodemon** - Development server hot-reload
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **Python** (version 3.8 or higher)
- **MongoDB** (local or Atlas)
- **Ollama** (for AI functionality)
- **Git**

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/SHUBHAM2775/NFC4_DeepThink.git
cd NFC4_DeepThink
```

#### 2. Backend Setup
```bash
cd Backend
npm install
```

Create `.env` file in Backend directory:
```env
MONGO_URI=mongodb://localhost:27017/pregnancy_care
PORT=5000
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SID=your_twilio_verify_sid
JWT_SECRET=your_jwt_secret_key
```

#### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```

#### 4. AI Assistant Setup
```bash
cd ../ai_assistant
pip install -r requirements.txt
```

Create `.env` file in ai_assistant directory:
```env
OLLAMA_HOST=http://localhost:11434
FLASK_PORT=5001
```

#### 5. Ollama Setup
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download the model
ollama pull llama3.2
```

### Running the Application

#### Start All Services
```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start Backend Server
cd Backend
npm run dev

# Terminal 3: Start Frontend Development Server
cd Frontend
npm run dev

# Terminal 4: Start AI Assistant
cd ai_assistant
python app.py
```

#### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **AI Assistant**: http://localhost:5001

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/send-otp` - Send OTP for phone verification
- `POST /api/auth/verify-otp` - Verify OTP and authenticate user

### Registration Endpoints
- `POST /api/register/pregnant-lady` - Register pregnant woman
- `POST /api/register/asha-worker` - Register ASHA worker
- `POST /api/register/admin` - Register system administrator

### Voice Log Endpoints
- `POST /api/voice/log` - Create new voice log entry
- `GET /api/voice/logs/:userId` - Retrieve user's voice logs
- `DELETE /api/voice/log/:logId` - Delete specific voice log

### AI Assistant Endpoints
- `POST /guidance` - Get AI pregnancy guidance
- `GET /history/:user_id` - Retrieve pregnancy journey history
- `POST /monitor` - Submit symptoms for monitoring
- `POST /test/multilingual` - Test multilingual capabilities

### Reminder Endpoints
- `POST /api/reminders/create` - Create personalized reminder
- `GET /api/reminders/:userId` - Get user's reminders
- `PUT /api/reminders/:reminderId` - Update reminder

## 🎯 Use Cases

### For Pregnant Women
- **Daily Health Logging**: Voice-enabled pregnancy symptom tracking
- **AI Guidance**: Personalized advice based on pregnancy week and history
- **Emergency Alerts**: Automatic escalation for concerning symptoms
- **Appointment Reminders**: AI-generated personalized reminder system
- **Multilingual Support**: Native language communication

### For ASHA Workers
- **Patient Management**: Track multiple pregnant women in their area
- **Health Monitoring**: Review patient logs and AI assessments
- **Emergency Response**: Receive alerts for high-risk situations
- **Document Verification**: Upload and manage health certificates
- **Community Outreach**: Coordinate care delivery in rural areas

### For Healthcare Administrators
- **System Overview**: Monitor platform usage and health trends
- **Resource Allocation**: Analyze data for healthcare planning
- **Quality Assurance**: Review AI recommendations and outcomes
- **Policy Implementation**: Deploy health initiatives through the platform

## 🛡️ Security & Privacy

- **Local AI Processing**: All AI computations happen locally, ensuring data privacy
- **Encrypted Communications**: HTTPS/WSS for all client-server communications
- **Secure Authentication**: JWT-based authentication with phone verification
- **Data Minimization**: Only essential health data is collected and stored
- **GDPR Compliance**: User data rights and deletion capabilities
- **Role-Based Access**: Granular permissions based on user roles

## 🌐 Internationalization

The platform supports multiple languages with:
- **Dynamic Language Switching**: Real-time language changes
- **RTL Support**: Right-to-left language compatibility
- **Cultural Adaptation**: Region-specific health advice
- **Voice Recognition**: Multi-language speech-to-text
- **AI Responses**: Native language AI communications

## 🔄 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow ESLint configuration for code style
- Write descriptive commit messages
- Add tests for new features
- Update documentation for API changes
- Ensure cross-browser compatibility

## 🧪 Testing

### Backend Testing
```bash
cd Backend
npm test
```

### Frontend Testing
```bash
cd Frontend
npm run test
```

### AI Assistant Testing
```bash
cd ai_assistant
python test_memory_multilingual.py
```

## 📈 Future Roadmap

### Phase 1 (Current)
- ✅ Core pregnancy tracking system
- ✅ AI-powered guidance with memory
- ✅ Multilingual support (10+ languages)
- ✅ Voice logging functionality
- ✅ Emergency escalation system

### Phase 2 (Planned)
- 🔄 Mobile app development (React Native)
- 🔄 Telemedicine integration
- 🔄 Wearable device connectivity
- 🔄 Advanced analytics dashboard
- 🔄 Machine learning model improvements

### Phase 3 (Future)
- 📋 Integration with government health systems
- 📋 Blockchain-based health records
- 📋 IoT device ecosystem
- 📋 AI-powered risk prediction models
- 📋 Global health network expansion

## 🏆 Hackathon Highlights

### Innovation Points
- **Local AI Integration**: First pregnancy platform with complete local AI processing
- **Memory-Driven AI**: Contextual understanding that grows with pregnancy journey
- **Multilingual AI**: Native language AI responses for healthcare accessibility
- **Voice-First Interface**: Speech recognition optimized for rural connectivity
- **Emergency Intelligence**: AI-powered health risk assessment and escalation

### Social Impact
- **Healthcare Accessibility**: Bridges language and technology barriers
- **Rural Healthcare**: Designed specifically for underserved communities
- **ASHA Worker Empowerment**: Technology tools for community health workers
- **Data Privacy**: Local processing ensures sensitive health data stays private
- **Scalable Solution**: Architecture designed for millions of users

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join project discussions for feature requests
- **Email**: Contact the development team at [your-email@domain.com]

### Common Issues
- **Ollama Connection**: Ensure Ollama is running on port 11434
- **MongoDB Connection**: Verify MongoDB service is active
- **Port Conflicts**: Check if ports 5000, 5173, 5001 are available
- **Environment Variables**: Ensure all required .env variables are set

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by the DeepThink team for NFC4 Hackathon

- **Project Lead**: [Shubham Upadhyay](https://github.com/SHUBHAM2775)
- **Frontend Development**: React + Vite + Tailwind CSS
- **Backend Development**: Node.js + Express + MongoDB
- **AI Development**: Python + Ollama + Custom NLP
- **UI/UX Design**: Modern, accessible, multilingual interface

## 🙏 Acknowledgments

- **Ollama Team** for the local AI infrastructure
- **OpenAI** for inspiring AI conversational patterns
- **React Community** for excellent development tools
- **Healthcare Workers** who inspired this solution
- **NFC4 Hackathon** for the platform to build impactful technology

---

### 📸 Screenshots

*[Screenshots will be added here once you capture them]*

### 🎬 Demo Video

*[Demo video link will be added here]*

---

**Built for NFC4 Hackathon 2025 - Empowering Pregnancy Care Through Technology** 🚀
