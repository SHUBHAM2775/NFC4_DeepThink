const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const registerRoutes = require("./routes/registerRoutes");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost/otp-login", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes); // e.g. /api/auth/send-otp
app.use("/api", registerRoutes); // e.g. /api/register/admin

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
