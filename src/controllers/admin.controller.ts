import type { RequestHandler } from "express";
import { User } from "../models/user.model.js";
import { Monument } from "../models/monument.model.js";
import { currentUser } from "../middlewares/require-auth.js";
import { badRequestError, notFoundError } from "../errors/http-error.js";

const publicUser = (user: User) => ({ id: user.id, username: user.username, role: user.role, createdAt: user.createdAt });

export const overview: RequestHandler = async (_req, res) => {
  const [users, monuments] = await Promise.all([User.findAll({ order: [["createdAt", "DESC"]] }), Monument.count()]);
  res.json({ message: "Tableau de bord administrateur", data: { users: users.map(publicUser), monumentCount: monuments } });
};

export const updateUser: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const role = req.body?.role;
  if (!Number.isInteger(id) || !["visitor", "guide", "admin"].includes(role)) throw badRequestError("Le rôle est invalide.");
  const user = await User.findByPk(id);
  if (!user) throw notFoundError("Utilisateur introuvable.");
  user.role = role;
  await user.save();
  res.json({ message: "Rôle mis à jour.", data: publicUser(user) });
};

export const removeUser: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const { userId } = currentUser(req);
  if (id === userId) throw badRequestError("Un administrateur ne peut pas supprimer son propre compte.");
  const user = await User.findByPk(id);
  if (!user) throw notFoundError("Utilisateur introuvable.");
  await user.destroy();
  res.json({ message: "Utilisateur supprimé.", data: null });
};