const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const registerRoutes = require("./routes/registerRoutes");
app.use("/api/register", registerRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const voiceLogRoutes = require("./routes/voiceLogRoutes");
app.use("/api/voice", voiceLogRoutes);

const verificationRoutes = require("./routes/verificationRoutes");
app.use("/api/verification", verificationRoutes);

const ashaWorkerRoutes = require("./routes/ashaWorkerRoutes");
app.use("/api/asha-worker", ashaWorkerRoutes);

const pregnantLadyRoutes = require("./routes/pregnantLadyRoutes");
app.use("/api/pregnant-lady", pregnantLadyRoutes);

// Add reminder routes for AI-powered personalized reminders
const reminderRoutes = require("./routes/reminderRoutes");
app.use("/api/reminders", reminderRoutes);

module.exports = app;
