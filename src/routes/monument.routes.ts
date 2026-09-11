import { Router } from "express";
import * as monumentController from "../controllers/monument.controller.js";

export const monumentRouter = Router();

/**
 * @swagger
 * /monuments:
 *   get:
 *     summary: Liste les monuments
 *     tags: [Monuments]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *         description: Filtre sur le titre (recherche partielle)
 *       - in: query
 *         name: orderBy
 *         schema: { type: string, enum: [title, buildYear, createdAt] }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: La liste, éventuellement vide
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Monument' }
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Token manquant ou invalide
 */
monumentRouter.get("/", monumentController.findAll);

/**
 * @swagger
 * /monuments/{id}:
 *   get:
 *     summary: Récupère un monument par son identifiant
 *     tags: [Monuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Le monument demandé
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data: { $ref: '#/components/schemas/Monument' }
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Aucun monument avec cet identifiant
 */
monumentRouter.get("/:id", monumentController.findById);

/**
 * @swagger
 * /monuments:
 *   post:
 *     summary: Crée un monument
 *     tags: [Monuments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MonumentInput'
 *     responses:
 *       201:
 *         description: Monument créé
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data: { $ref: '#/components/schemas/Monument' }
 *       400:
 *         description: Données invalides (règles du modèle) ou JSON mal formé
 *       401:
 *         description: Token manquant ou invalide
 */
monumentRouter.post("/", monumentController.create);

/**
 * @swagger
 * /monuments/{id}:
 *   put:
 *     summary: Met à jour un monument (mise à jour partielle acceptée)
 *     tags: [Monuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MonumentInput'
 *     responses:
 *       200:
 *         description: Monument mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data: { $ref: '#/components/schemas/Monument' }
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Aucun monument avec cet identifiant
 */
monumentRouter.put("/:id", monumentController.update);

/**
 * @swagger
 * /monuments/{id}:
 *   delete:
 *     summary: Supprime un monument
 *     tags: [Monuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Monument supprimé (renvoyé dans data)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data: { $ref: '#/components/schemas/Monument' }
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Aucun monument avec cet identifiant
 */
monumentRouter.delete("/:id", monumentController.remove);