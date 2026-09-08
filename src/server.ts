import express from "express";
import { nightBlocker } from "./middlewares/night-blocker.js";
import { logger } from "./middlewares/logger.js";
import { visitCounter } from "./middlewares/visit-counter.js";
import { env } from "./config/env.js";
import { initDatabase } from "./db/sequelize.js";

await initDatabase();

const app = express();
app.use(nightBlocker);
app.use(logger);
app.use(visitCounter);

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Monumento !");
});

app.get("/visit", (req, res) => {
  res.send(`Vous êtes le visiteur n° ${req.visit}`);
});

app.listen(env.PORT, () => {
  console.log(`API démarrée sur http://localhost:${env.PORT}`);
});