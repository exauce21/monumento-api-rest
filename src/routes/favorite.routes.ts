import { Router } from "express";
import * as favoriteController from "../controllers/favorite.controller.js";

export const favoriteRouter = Router();

favoriteRouter.post("/:monumentId", favoriteController.add);
favoriteRouter.delete("/:monumentId", favoriteController.remove);
favoriteRouter.get("/", favoriteController.findAll);