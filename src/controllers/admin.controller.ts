import type { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { User } from "../models/user.model.js";
import { currentUser } from "../middlewares/require-auth.js";
import { badRequestError, notFoundError } from "../errors/http-error.js";

const PUBLIC_USER_ATTRIBUTES = ["id", "username", "role", "createdAt", "updatedAt"] as const;
const ROLES = ["visitor", "guide", "admin"] as const;
type ManagedRole = (typeof ROLES)[number];

function parseUserId(value: string): number {
  const userId = Number(value);
  if (!Number.isInteger(userId) || userId <= 0) throw badRequestError("L'identifiant utilisateur est invalide.");
  return userId;
}

function validateRole(value: unknown): ManagedRole {
  if (typeof value !== "string" || !ROLES.includes(value as ManagedRole)) {
    throw badRequestError("Le rôle doit être visitor, guide ou admin.");
  }
  return value as ManagedRole;
}

export const listUsers: RequestHandler = async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const role = typeof req.query.role === "string" ? req.query.role : undefined;
  const where = search ? { username: { [Op.like]: `%${search}%` } } : {};
  if (role) Object.assign(where, { role: validateRole(role) });

  const users = await User.findAll({
    where,
    attributes: [...PUBLIC_USER_ATTRIBUTES],
    order: [["createdAt", "DESC"]],
  });
  res.json({ message: "Liste des utilisateurs", data: users });
};

export const updateUser: RequestHandler = async (req, res) => {
  const userId = parseUserId(String(req.params.id));
  const user = await User.findByPk(userId);
  if (!user) throw notFoundError("Utilisateur introuvable.");

  const body = (req.body ?? {}) as Record<string, unknown>;
  if (body.username !== undefined) {
    if (typeof body.username !== "string" || body.username.trim().length < 3 || body.username.trim().length > 25) {
      throw badRequestError("Le nom d'utilisateur doit contenir entre 3 et 25 caractères.");
    }
    user.username = body.username.trim();
  }
  if (body.role !== undefined) user.role = validateRole(body.role);
  if (body.password !== undefined) {
    if (typeof body.password !== "string" || body.password.length < 6) throw badRequestError("Le mot de passe doit contenir au moins 6 caractères.");
    user.password = await bcrypt.hash(body.password, 12);
  }

  await user.save();
  const { password: _password, ...publicUser } = user.get({ plain: true });
  res.json({ message: "Utilisateur mis à jour", data: publicUser });
};

export const removeUser: RequestHandler = async (req, res) => {
  const userId = parseUserId(String(req.params.id));
  const { userId: currentUserId } = currentUser(req);
  if (userId === currentUserId) throw badRequestError("Un administrateur ne peut pas supprimer son propre compte.");

  const deleted = await User.destroy({ where: { id: userId } });
  if (!deleted) throw notFoundError("Utilisateur introuvable.");
  res.status(204).send();
};
