import type { RequestHandler } from "express";
import { Monument } from "../models/monument.model.js";
import { Favorite } from "../models/favorite.model.js";
import { User } from "../models/user.model.js";
import { currentUser } from "../middlewares/require-auth.js";
import { badRequestError, notFoundError } from "../errors/http-error.js";

function getMonumentId(value: unknown): number {
  if (typeof value !== "string") {
    throw badRequestError("L'identifiant du monument est invalide.");
  }

  const monumentId = Number(value);
  if (!Number.isInteger(monumentId) || monumentId <= 0) {
    throw badRequestError("L'identifiant du monument est invalide.");
  }
  return monumentId;
}

export const add: RequestHandler = async (req, res) => {
  const { userId } = currentUser(req);
  const monumentId = getMonumentId(req.params.monumentId);
  const monument = await Monument.findByPk(monumentId);

  if (!monument) {
    throw notFoundError(`Le monument avec l'ID ${monumentId} n'a pas été trouvé`);
  }

  const favorite = await Favorite.create({ userId, monumentId });
  res.status(201).json({ message: "Monument ajouté aux favoris", data: favorite });
};

export const remove: RequestHandler = async (req, res) => {
  const { userId } = currentUser(req);
  const monumentId = getMonumentId(req.params.monumentId);
  const monument = await Monument.findByPk(monumentId);

  if (!monument) {
    throw notFoundError(`Le monument avec l'ID ${monumentId} n'a pas été trouvé`);
  }

  const favorite = await Favorite.findOne({ where: { userId, monumentId } });
  if (!favorite) {
    throw notFoundError("Ce monument ne fait pas partie de vos favoris.");
  }

  await favorite.destroy();
  res.json({ message: "Monument retiré des favoris", data: null });
};

export const findAll: RequestHandler = async (req, res) => {
  const { userId } = currentUser(req);
  const monuments = await Monument.findAll({
    include: [
      {
        model: User,
        as: "favoritedBy",
        attributes: [],
        through: { attributes: [] },
        where: { id: userId },
      },
    ],
  });

  res.json({ message: "Liste des monuments favoris", data: monuments });
};
