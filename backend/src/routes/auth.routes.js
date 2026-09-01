import { Router } from "express";
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  ssoLogin
} from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/send-otp
router.post("/send-otp", sendOtp);

// POST /api/auth/verify-otp
router.post("/verify-otp", verifyOtp);

// POST /api/auth/sso
router.post("/sso", ssoLogin);

export default router;
