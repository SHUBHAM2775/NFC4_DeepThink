const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Mount login route
app.use("/api/auth", authRoutes);
// Mount question routes

module.exports = app;