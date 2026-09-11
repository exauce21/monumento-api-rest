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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Crée un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Données invalides ou nom d'utilisateur déjà utilisé
 */
authRouter.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       200:
 *         description: Jetons d'authentification générés
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data: { $ref: '#/components/schemas/AuthTokens' }
 *       401:
 *         description: Identifiants incorrects
 */
authRouter.post("/login", loginLimiter, authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Renouvelle le jeton d'accès
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Nouveau jeton généré
 *       401:
 *         description: Jeton de rafraîchissement invalide ou expiré
 */
authRouter.post("/refresh-token", authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnecte l'utilisateur courant
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Déconnexion effectuée
 *       401:
 *         description: Token manquant ou invalide
 */
authRouter.post("/logout", requireAuth, authController.logout);