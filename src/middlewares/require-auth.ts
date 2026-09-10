import type { RequestHandler, Request } from "express";
import { TokenPayload, verifyAccessToken } from "../services/token.service.js";
import { unauthorizedError } from "../errors/http-error.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) throw unauthorizedError("Token d'authentification manquant.");

  req.user = verifyAccessToken(token);
  next();
};

export function currentUser(req: Request): TokenPayload {
  if (!req.user) throw unauthorizedError("Utilisateur non authentifié.");
  return req.user;
}