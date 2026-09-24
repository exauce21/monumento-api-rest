import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";

export const adminRouter = Router();

adminRouter.get("/overview", adminController.overview);
adminRouter.patch("/users/:id", adminController.updateUser);
adminRouter.delete("/users/:id", adminController.removeUser);