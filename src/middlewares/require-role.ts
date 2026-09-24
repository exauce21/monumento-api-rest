import type { RequestHandler } from "express";
import { currentUser } from "./require-auth.js";
import { forbiddenError } from "../errors/http-error.js";
import type { Role } from "../services/token.service.js";

export function requireRole(...roles: Role[]): RequestHandler {
  return (req, _res, next) => {
    const user = currentUser(req);
    if (!roles.includes(user.role)) throw forbiddenError("Vous n'avez pas les droits nécessaires.");
    next();
  };
}