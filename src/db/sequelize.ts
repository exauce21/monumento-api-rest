import { Sequelize } from "sequelize";
import { env } from "../config/env.js";

export const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "mysql",
  logging: env.NODE_ENV === "development" ? console.log : false,
}); 

export async function initDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie.");
    await sequelize.sync({ alter: true });
    console.log("Tables synchronisées.");
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
  }
}
