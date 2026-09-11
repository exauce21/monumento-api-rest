import { Router } from "express";
import * as anecdoteController from "../controllers/anecdote.controller.js";

export const anecdoteRouter = Router();

anecdoteRouter.put("/:id", anecdoteController.update);
anecdoteRouter.delete("/:id", anecdoteController.remove);
