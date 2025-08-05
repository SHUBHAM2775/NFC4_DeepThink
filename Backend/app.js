const express = require("express");
const cors = require("cors");

console.log("✅ app.js loaded");

const app = express();

app.use(cors());
app.use(express.json());


const registerRoutes = require("./routes/registerRoutes");
app.use("/api/register", registerRoutes);


const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


const voiceLogRoutes = require("./routes/voiceLogRoutes");
app.use("/api/voice", voiceLogRoutes);


module.exports = app;
