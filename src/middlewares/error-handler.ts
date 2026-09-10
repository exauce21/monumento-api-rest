import type { ErrorRequestHandler } from "express";
import { ValidationError, UniqueConstraintError } from "sequelize";
import { env } from "../config/env.js";
import { HttpError, badRequestError, internalServerError, unauthorizedError } from "../errors/http-error.js";
import jwt from "jsonwebtoken";
const { TokenExpiredError, JsonWebTokenError } = jwt;


function toHttpError(err: unknown): HttpError {
  if (err instanceof HttpError) return err;

  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    return badRequestError("Erreur de validation", err.errors.map((e) => e.message));
  }

  if (typeof err === "object" && err !== null && (err as { type?: string }).type === "entity.parse.failed") {
    return badRequestError("Le corps de la requête n'est pas un JSON valide.");
  }

  if (typeof err === "object" && err !== null && (err as { name?: string }).name === "UnauthorizedError") {
    return unauthorizedError("Vous n'êtes pas autorisé à accéder à cette ressource.");
  }

  if (err instanceof TokenExpiredError) return unauthorizedError("Le token a expiré.");

  if (err instanceof JsonWebTokenError) return unauthorizedError("Le token est invalide.");

  return internalServerError(
    "Une erreur serveur est survenue. Veuillez réessayer plus tard.",
    env.NODE_ENV === "development" && err instanceof Error ? err.message : null,
  );
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const httpError = toHttpError(err);

  if (httpError.status >= 500) {
    console.error("Erreur serveur :", err);
  }

  res.status(httpError.status).json({ message: httpError.message, data: httpError.data });
};