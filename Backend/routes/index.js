import express from "express";
import authRoutes from "./authRoutes";
import registerRoutes from "./registerRoutes";

const router = express.Router();

// Use authentication routes
router.use("/auth", authRoutes);
router.use("/register", registerRoutes);

export default router;
