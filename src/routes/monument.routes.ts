import { Router } from "express";
import * as monumentController from "../controllers/monument.controller.js";

export const monumentRouter = Router();

monumentRouter.get("/", monumentController.findAll);
monumentRouter.get("/:id", monumentController.findById);
monumentRouter.post("/", monumentController.create);
monumentRouter.put("/:id", monumentController.update);
monumentRouter.delete("/:id", monumentController.remove);