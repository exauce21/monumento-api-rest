import { Router } from "express";
import * as anecdoteController from "../controllers/anecdote.controller.js";

export const anecdoteRouter = Router();

/**
 * @swagger
 * /anecdotes/{id}:
 *   put:
 *     summary: Modifie une anecdote
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
 *       200:
 *         description: Anecdote modifiée
 *       400:
 *         description: Contenu absent ou invalide
 *       404:
 *         description: Anecdote introuvable
 */
anecdoteRouter.put("/:id", anecdoteController.update);

/**
 * @swagger
 * /anecdotes/{id}:
 *   delete:
 *     summary: Supprime une anecdote
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
 *         description: Anecdote supprimée
 *       404:
 *         description: Anecdote introuvable
 */
anecdoteRouter.delete("/:id", anecdoteController.remove);
