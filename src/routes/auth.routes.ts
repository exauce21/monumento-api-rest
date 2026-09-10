import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/require-auth.js";
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: "Trop de tentatives. Réessayez dans 15 minutes.", data: null },
  standardHeaders: true,
  legacyHeaders: false,
});


export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", loginLimiter, authController.login);
authRouter.post("/refresh-token", authController.refresh);
authRouter.post("/logout", requireAuth, authController.logout);