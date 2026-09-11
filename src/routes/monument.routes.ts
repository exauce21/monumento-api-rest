import { Router } from "express";
import * as monumentController from "../controllers/monument.controller.js";
import * as anecdoteController from "../controllers/anecdote.controller.js";

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

/**
 * @swagger
 * /monuments/{id}/anecdotes:
 *   get:
 *     summary: Liste les anecdotes d'un monument
 *     tags: [Anecdotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Liste des anecdotes
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Anecdote' }
 *       404:
 *         description: Monument introuvable
 */
monumentRouter.get("/:id/anecdotes", anecdoteController.findAllByMonument);

/**
 * @swagger
 * /monuments/{id}/anecdotes:
 *   post:
 *     summary: Ajoute une anecdote à un monument
 *     tags: [Anecdotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AnecdoteInput' }
 *     responses:
 *       201:
 *         description: Anecdote créée
 *       400:
 *         description: Contenu absent ou invalide
 *       404:
 *         description: Monument introuvable
 */
monumentRouter.post("/:id/anecdotes", anecdoteController.create);