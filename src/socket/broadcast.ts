import type { Server } from "socket.io";
import type { ServerToClientEvents } from "./events.js";

let io: Server<{}, ServerToClientEvents> | undefined;

export function registerSocketServer(server: Server<{}, ServerToClientEvents>): void {
  io = server;
}

export function emitMonumentCreated(monument: {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
}): void {
  io?.emit("monument:created", {
    id: monument.id,
    title: monument.title,
    description: monument.description,
    createdAt: monument.createdAt.toISOString(),
  });
}
