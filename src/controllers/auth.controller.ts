import { RequestHandler } from 'express';
import * as authService from '../services/auth.service.js';
import { badRequestError } from '../errors/http-error.js';
import { signAccessToken } from "../services/token.service.js";
import { currentUser } from "../middlewares/require-auth.js";

function validateCredentials(body: unknown): authService.Credentials {
  if (!body || typeof body !== "object") {
    throw badRequestError("Les identifiants sont invalides.");
  }

  const { username, password } = body as Record<string, unknown>;

  if (!username || typeof username !== "string") {
    throw badRequestError("Le nom d'utilisateur est requis.");
  }

  if (!password || typeof password !== "string") {
    throw badRequestError("Le mot de passe est requis.");
  }

  return { username, password };
}

export const register: RequestHandler = async (req, res) => {
  const credentials = validateCredentials(req.body);
  const newUser = await authService.register(credentials);
  res.status(201).json({ message: "Utilisateur enregistré avec succès.", data: newUser });
}

export const login: RequestHandler = async (req, res) => {
  const credentials = validateCredentials(req.body);
  const { user, tokens } = await authService.login(credentials);
  res.json({ message: "Authentification réussie.", data: { userId: user.id, ...tokens } });
}

export const refresh: RequestHandler = async (req, res) => {
  const { refreshToken } = (req.body ?? {}) as Record<string, unknown>;
  if (typeof refreshToken !== "string") throw badRequestError("refreshToken est requis.");
  const accessToken = await authService.refresh(refreshToken);
  res.json({ message: "Nouveau token d'accès généré.", data: { accessToken } });
};

export const logout: RequestHandler = async (req, res) => {
  const { userId } = currentUser(req);
  await authService.logout(userId);
  res.status(204).send();
};