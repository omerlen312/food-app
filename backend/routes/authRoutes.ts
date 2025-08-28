import express from "express";
import {
  register,
  login,
  getProfile,
  logout,
} from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Private routes (authentication required)
router.get("/profile", authenticate, getProfile);

export default router;
