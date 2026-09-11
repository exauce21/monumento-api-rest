import http from "node:http";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { setupSocketServer } from "./socket/index.js";

// Import models to ensure they are registered with Sequelize
import "./models/monument.model.js";
import "./models/user.model.js";
import "./models/anecdote.model.js";

import { initDatabase } from "./db/sequelize.js";
 
// Initialize the database
await initDatabase();

const app = createApp();
const server = http.createServer(app);
setupSocketServer(server);

server.listen(env.PORT, () => {
  console.log(`API démarrée sur http://localhost:${env.PORT}`);
});