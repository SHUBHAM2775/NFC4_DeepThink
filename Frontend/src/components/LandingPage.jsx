import React from "react";

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

const LandingPage = () => (
  <div style={{ background: "#fff", minHeight: "100vh" }}>
    {/* HERO SECTION */}
    <section style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "56px 8vw 40px 8vw",
      background: "#fff"
    }}>
      <div style={{ maxWidth: 540, color: "#5e656e" }}>
        <div style={{ fontSize: 18, letterSpacing: "0.02em", fontWeight: 500 }}>
          <span style={{ color: "#18c688" }}>Maternal Health Tracker</span>
        </div>
        <h1 style={{
          fontSize: 44,
          fontWeight: 700,
          lineHeight: 1.10,
          margin: "14px 0 24px 0",
          color: "#5e656e"
        }}>
          Empowering <span style={{ color: "#e53986" }}>Rural Mothers</span> <br />with <span style={{ color: "#e53986" }}>AI Care</span>
        </h1>
        <p style={{ fontSize: 20, color: "#5e656e", marginBottom: 32 }}>
          A life-saving maternal health tracking application designed for rural India. Supporting pregnant women with voice-based guidance, emergency assistance, and personalized AI health monitoring.
        </p>
        <div style={{ display: "flex", gap: 18, marginBottom: 36 }}>
          <button style={{
            background: "#e53986",
            color: "#fff",
            fontWeight: 600,
            fontSize: 18,
            padding: "14px 32px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer"
          }}>
            Start Tracking Health
          </button>
          <button style={{
            background: "#f2f2f2",
            color: "#b1b1b1",
            fontWeight: 600,
            fontSize: 18,
            padding: "14px 32px",
            borderRadius: 8,
            border: "none",
            cursor: "default"
          }}>
            Learn More
          </button>
        </div>
        <div style={{ display: "flex", gap: 38 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#18c688", fontSize: 28 }}>{icons.emergency}</div>
            <div style={{ color: "#5e656e", marginTop: "2px" }}>24/7<br />Emergency Support</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#18c688", fontSize: 28 }}>{icons.languages}</div>
            <div style={{ color: "#5e656e", marginTop: "2px" }}>8+<br />Local Languages</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#18c688", fontSize: 28 }}>{icons.voice}</div>
            <div style={{ color: "#5e656e", marginTop: "2px" }}>Voice<br />Based Interface</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#18c688", fontSize: 28 }}>{icons.ai}</div>
            <div style={{ color: "#5e656e", marginTop: "2px" }}>AI<br />Health Assistant</div>
          </div>
        </div>
      </div>
      {/* Illustrative image */}
      <div>
        <img
          src="your-hero-image.png"
          alt=""
          style={{
            borderRadius: 18,
            width: 410,
            height: 270,
            objectFit: "cover",
            boxShadow: "0 6px 26px #a7ffc419"
          }}
        />
        {/* Example overlays for Daily Health Log & Emergency Alert */}
        <div style={{
          position: "relative",
          top: "-86px",
          left: "18px"
        }}>
          <div style={{
            background: "#fff",
            color: "#349d8b",
            fontWeight: 600,
            padding: "4px 15px",
            fontSize: 16,
            borderRadius: 10,
            marginBottom: 0,
            display: "inline-block"
          }}>
            Daily Health Log <span style={{ color: "#bbb", fontWeight: 400 }}>{' '}Voice guided tracking</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          float: "right",
          top: "-33px",
          right: "25px"
        }}>
          <div style={{
            background: "#fff",
            color: "#e53986",
            fontWeight: 600,
            padding: "4px 15px",
            fontSize: 16,
            borderRadius: 10,
            marginTop: 10,
            display: "inline-block"
          }}>
            Emergency Alert <span style={{ color: "#bbb", fontWeight: 400 }}>{' '}One-tap GPS location</span>
          </div>
        </div>
      </div>
    </section>

    {/* CHALLENGES SECTION */}
    <section style={{ background: "#f7fafd", padding: "64px 0" }}>
      <div style={{ width: "84vw", margin: "0 auto" }}>
        <h2 style={{
          color: "#212121",
          textAlign: "center",
          fontWeight: 700,
          fontSize: 34
        }}>
          Addressing Critical Healthcare Challenges
        </h2>
        <p style={{
          textAlign: "center",
          color: "#5e656e",
          marginTop: 10,
          fontSize: 19
        }}>
          In rural India, maternal healthcare faces significant barriers that put both mothers and babies at risk. Our solution addresses these fundamental challenges.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginTop: 45,
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          {challenges.map((c, idx) => (
            <div key={idx} style={{
              background: "#fff",
              borderRadius: 18,
              padding: "26px 24px",
              boxShadow: "0 1px 10px #0001",
              display: "flex",
              gap: 15,
              alignItems: "flex-start"
            }}>
              <span style={{ fontSize: 29, color: "#e53986", flexShrink: 0 }}>{c.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#5e656e", fontSize: 18, marginBottom: 3 }}>{c.title}</div>
                <div style={{ color: "#7b8190", fontSize: 15 }}>{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* SOLUTION SECTION */}
    <section style={{ padding: "36px 0", background: "#f7fafd", textAlign: "center" }}>
      <h3 style={{ fontSize: 28, color: "#e53986", fontWeight: 700, marginBottom: 10 }}>Our Solution: AI-Powered Maternal Care</h3>
      <p style={{
        color: "#5e656e",
        fontSize: 18,
        maxWidth: 820,
        margin: "0 auto"
      }}>
        We're developing a comprehensive maternal health tracking application that bridges these gaps through voice-based interfaces, multilingual support, offline capabilities, and AI-assisted health monitoring designed specifically for rural communities.
      </p>
    </section>

    {/* FEATURES SECTION */}
    <section style={{ background: "#fff", padding: "58px 0 68px 0" }}>
      <h2 style={{
        color: "#212121",
        textAlign: "center",
        fontWeight: 700,
        fontSize: 33
      }}>
        Comprehensive Healthcare Features
      </h2>
      <p style={{ textAlign: "center", color: "#5e656e", fontSize: 18, marginTop: 10 }}>
        Designed specifically for rural Indian communities, our platform bridges the gap between expectant mothers and quality healthcare through innovative technology.
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "28px",
        maxWidth: 1160,
        margin: "45px auto 0 auto"
      }}>
        {features.map((f, idx) => (
          <div key={idx} style={{
            background: "#f7fafd",
            borderRadius: 15,
            padding: "26px",
            boxShadow: "0 1px 10px #0001"
          }}>
            <div style={{ color: "#e53986", fontSize: 29 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, color: "#5e656e", fontSize: 17, margin: "12px 0 7px 0" }}>{f.title}</div>
            <div style={{ color: "#7b8190", fontSize: 15 }}>{f.text}</div>
          </div>
        ))}
      </div>
    </section>

    {/* FOOTER */}
    <footer style={{
      background: "#f7fafd",
      color: "#5e656e",
      fontWeight: 500,
      padding: "28px 0 20px 0",
      textAlign: "center",
      borderTop: "1px solid #eaeaea"
    }}>
      <div>
        Maternal Health Tracker &copy; {new Date().getFullYear()} | Built for rural communities | For queries: care@mama-sahayta.in
      </div>
    </footer>
  </div>
);

export default LandingPage;
