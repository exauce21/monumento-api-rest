import type http from "node:http";
import { Server } from "socket.io";
import type { ChatMessage, ClientToServerEvents, ServerToClientEvents, SocketData } from "./events.js";
import { verifyAccessToken, type TokenPayload } from "../services/token.service.js";
import { registerSocketServer } from "./broadcast.js";

export function setupSocketServer(server: http.Server) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(server, {
    cors: { origin: "*" },
  });
  registerSocketServer(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if(typeof token !== "string"){
        return next(new Error("Token manquant ou invalide"));
    }

    try {
        socket.data.user = verifyAccessToken(token);
        next();
    } catch (err) {
        return next(new Error("Token invalide"));
    }
  });

  async function broadcastPresence() {
    const sockets = await io.fetchSockets();
    const guides = sockets.filter((s) => s.data.user.role === "guide").length;
    io.emit("presence:update", { visitors: sockets.length - guides, guides });
  }

  io.on("connection", (socket) => {
    const { username, role } = socket.data.user;
    console.log(`${username} (${role}) connecté`);
    broadcastPresence();

    socket.on("chat:send", (payload) => {
      const text = typeof payload?.text === "string" ? payload.text.trim() : "";
      if (text.length === 0 || text.length > 500) {
        return socket.emit("chat:error", "Le message doit contenir entre 1 et 500 caractères.");
      }
      const message: ChatMessage = { 
        from: username, 
        role, 
        text, 
        date: new Date().toISOString() 
      };
      io.emit("chat:message", message);
    });

    socket.on("disconnect", () => {
      console.log(`${username} déconnecté`);
      broadcastPresence();
    });

  });

  return io;
}