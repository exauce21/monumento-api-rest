import { Router } from "express";
import * as favoriteController from "../controllers/favorite.controller.js";

export const favoriteRouter = Router();

/**
 * @swagger
 * /favorites/{monumentId}:
 *   post:
 *     summary: Ajoute un monument aux favoris de l'utilisateur connecté
 *     tags: [Favoris]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: monumentId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       201:
 *         description: Monument ajouté aux favoris
 *       400:
 *         description: Identifiant invalide ou favori déjà existant
 *       404:
 *         description: Monument introuvable
 */
favoriteRouter.post("/:monumentId", favoriteController.add);

/**
 * @swagger
 * /favorites/{monumentId}:
 *   delete:
 *     summary: Retire un monument des favoris
 *     tags: [Favoris]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: monumentId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Monument retiré des favoris
 *       404:
 *         description: Monument ou favori introuvable
 */
favoriteRouter.delete("/:monumentId", favoriteController.remove);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Liste les monuments favoris de l'utilisateur connecté
 *     tags: [Favoris]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des monuments favoris
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Monument' }
 */
favoriteRouter.get("/", favoriteController.findAll);