import React from "react";
import Header from "../navbar/Header";

// You may customize these icons or use a library like react-icons for better visuals
const icons = {
  emergency: "⏰",
  languages: "🌐",
  voice: "🎤",
  ai: "🤖",
  risk: "⚠️",
  access: "🚑",
  knowledge: "📚",
  supportTools: "🛠️",
  log: "📝",
  reminders: "🔔",
  labor: "📍",
  asha: "👩‍⚕️",
  family: "👨‍👩‍👧‍👦",
  language: "🌎",
  aiAssistant: "🤖"
};

const features = [
  {
    icon: icons.log,
    title: "Voice-Based Daily Log",
    text: "Capture symptoms, fetal movement, and nutrition through guided audio prompts in local languages."
  },
  {
    icon: icons.reminders,
    title: "Automated Reminders",
    text: "IVR/SMS notifications for medication, check-ups, vaccinations, and nutrition schedules."
  },
  {
    icon: icons.labor,
    title: "Emergency Labor Button",
    text: "One-tap emergency call with GPS location sent to nearest hospital, PHC, or ASHA worker."
  },
  {
    icon: icons.asha,
    title: "ASHA Worker Integration",
    text: "Comprehensive dashboard for health workers to track and assist assigned beneficiaries."
  },
  {
    icon: icons.family,
    title: "Family Member Access",
    text: "Allow husbands and family members to receive health reminders and updates on their phones."
  },
  {
    icon: icons.language,
    title: "Multi-Language Support",
    text: "Available in Marathi, Hindi, Gujarati, and other regional languages for better accessibility."
  },
  {
    icon: icons.aiAssistant,
    title: "AI Health Assistants",
    text: "Personalized agentic AI provides guidance, symptom monitoring, and emergency escalation support."
  }
];

const challenges = [
  {
    icon: icons.risk,
    title: "Life-Threatening Risks",
    text: "Pregnant women in rural India face severe health risks due to inadequate prenatal care and poor health monitoring systems."
  },
  {
    icon: icons.access,
    title: "Limited Healthcare Access",
    text: "Remote locations with limited connectivity to healthcare providers make timely medical intervention difficult."
  },
  {
    icon: icons.knowledge,
    title: "Knowledge Gap",
    text: "Many women are illiterate and unaware of proper nutrition, check-up schedules, or warning signs of complications."
  },
  {
    icon: icons.supportTools,
    title: "Inadequate Support Tools",
    text: "ASHA workers and family members lack proper tools to effectively guide and monitor maternal health journeys."
  }
];

const LandingPage = ({ onNavigateToLogin }) => (
  <>
    <Header onLoginClick={onNavigateToLogin} />
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="flex justify-between items-center px-[8vw] py-14 pb-10 bg-white">
        <div className="max-w-[540px] text-gray-600">
          <div className="text-[18px] tracking-wide font-medium text-green-600">Maternal Health Tracker</div>
          <h1 className="text-[44px] font-extrabold leading-tight mt-3 mb-6 text-gray-600">
            Empowering <span className="text-pink-600">Rural Mothers</span> <br />with <span className="text-pink-600">AI Care</span>
          </h1>
          <p className="text-[20px] mb-8">
            A life-saving maternal health tracking application designed for rural India. Supporting pregnant women with voice-based guidance, emergency assistance, and personalized AI health monitoring.
          </p>
          <div className="flex gap-4 mb-9">
            <button
              onClick={onNavigateToLogin}
              className="bg-pink-600 text-white font-semibold text-lg px-8 py-3 rounded-md cursor-pointer"
            >
              Start Tracking Health
            </button>
            <button
              disabled
              className="bg-gray-200 text-gray-400 font-semibold text-lg px-8 py-3 rounded-md cursor-not-allowed"
            >
              Learn More
            </button>
          </div>
          <div className="flex gap-9">
            <div className="text-center">
              <div className="text-green-600 text-4xl">{icons.emergency}</div>
              <div className="mt-0.5 text-gray-600 text-base">
                24/7<br />Emergency Support
              </div>
            </div>
            <div className="text-center">
              <div className="text-green-600 text-4xl">{icons.languages}</div>
              <div className="mt-0.5 text-gray-600 text-base">
                8+<br />Local Languages
              </div>
            </div>
            <div className="text-center">
              <div className="text-green-600 text-4xl">{icons.voice}</div>
              <div className="mt-0.5 text-gray-600 text-base">
                Voice<br />Based Interface
              </div>
            </div>
            <div className="text-center">
              <div className="text-green-600 text-4xl">{icons.ai}</div>
              <div className="mt-0.5 text-gray-600 text-base">
                AI<br />Health Assistant
              </div>
            </div>
          </div>
        </div>

        {/* Illustrative image */}
        <div className="relative">
          <img
            src="your-hero-image.png"
            alt=""
            className="rounded-xl w-[410px] h-[270px] object-cover shadow-[0_6px_26px_rgba(167,255,196,0.1)]"
          />
          {/* Overlays */}
          <div className="absolute top-[20px] left-[18px] bg-white rounded-lg px-4 py-1.5 text-teal-700 font-semibold text-base inline-block">
            Daily Health Log <span className="text-gray-400 font-normal">Voice guided tracking</span>
          </div>
          <div className="absolute top-[180px] right-[25px] bg-white rounded-lg px-4 py-1.5 text-pink-600 font-semibold text-base inline-block">
            Emergency Alert <span className="text-gray-400 font-normal">One-tap GPS location</span>
          </div>
        </div>
      </section>

      {/* CHALLENGES SECTION */}
      <section className="bg-[#f7fafd] py-16">
        <div className="max-w-[84vw] mx-auto">
          <h2 className="text-center text-4xl font-extrabold text-gray-900">Addressing Critical Healthcare Challenges</h2>
          <p className="text-center text-gray-600 text-lg mt-3 max-w-[680px] mx-auto">
            In rural India, maternal healthcare faces significant barriers that put both mothers and babies at risk. Our solution addresses these fundamental challenges.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-12 max-w-[900px] mx-auto">
            {challenges.map((c, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md flex gap-4 items-start"
              >
                <span className="text-pink-600 text-3xl flex-shrink-0">{c.icon}</span>
                <div>
                  <h3 className="text-gray-600 font-semibold text-lg mb-1">{c.title}</h3>
                  <p className="text-gray-500 text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="bg-[#f7fafd] py-9 text-center px-4">
        <h3 className="text-2xl font-extrabold text-pink-600 mb-2">Our Solution: AI-Powered Maternal Care</h3>
        <p className="max-w-[820px] mx-auto text-gray-600 text-lg">
          We're developing a comprehensive maternal health tracking application that bridges these gaps through voice-based interfaces, multilingual support, offline capabilities, and AI-assisted health monitoring designed specifically for rural communities.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-14">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Comprehensive Healthcare Features</h2>
        <p className="text-center text-gray-600 text-lg mt-3 max-w-[760px] mx-auto">
          Designed specifically for rural Indian communities, our platform bridges the gap between expectant mothers and quality healthcare through innovative technology.
        </p>
        <div className="grid grid-cols-3 gap-7 max-w-[1160px] mx-auto mt-12 px-4">
          {features.map((f, idx) => (
            <div key={idx} className="bg-[#f7fafd] rounded-xl p-6 shadow-md">
              <div className="text-pink-600 text-3xl mb-3">{f.icon}</div>
              <h4 className="text-gray-600 font-semibold text-lg mb-2">{f.title}</h4>
              <p className="text-gray-500 text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f7fafd] text-gray-600 font-medium py-7 text-center border-t border-gray-200">
        Maternal Health Tracker &copy; {new Date().getFullYear()} | Built for rural communities | For queries: care@mama-sahayta.in
      </footer>
    </div>
  </>
);

export default LandingPage;
