import express from "express";
import { nightBlocker } from "./middlewares/night-blocker.js";
import { logger } from "./middlewares/logger.js";
import { visitCounter } from "./middlewares/visit-counter.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { requireAuth } from "./middlewares/require-auth.js";
import { monumentRouter } from "./routes/monument.routes.js";
import { anecdoteRouter } from "./routes/anecdote.routes.js";
import { favoriteRouter } from "./routes/favorite.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import cors from "cors";
import helmet from "helmet";
import { mountSwagger } from "./docs/swagger.js";

export function createApp() {
  const app = express();

  // Middlewares
  app.use(helmet());
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));
  app.use(express.json());
  app.use(nightBlocker);
  app.use(logger);
  app.use(visitCounter);

  // Swagger
  mountSwagger(app);
  
  // Routes
  app.get("/", (_req, res) => {
    res.send("Bienvenue sur l'API Monumento !");
  });

  app.get("/visit", (req, res) => {
    res.send(`Vous êtes le visiteur n° ${req.visit}`);
  });

  app.use("/auth", authRouter);
  app.use("/monuments", requireAuth, monumentRouter);
  app.use("/anecdotes", requireAuth, anecdoteRouter);
  app.use("/favorites", requireAuth, favoriteRouter);

  // Erreurs (toujours en dernier)
  app.use(errorHandler);

  return app;
}