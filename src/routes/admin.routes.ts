import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middlewares/require-auth.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/users", adminController.listUsers);
adminRouter.patch("/users/:id", adminController.updateUser);
adminRouter.delete("/users/:id", adminController.removeUser);
