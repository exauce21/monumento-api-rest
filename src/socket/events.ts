import type { Role, TokenPayload } from "../services/token.service.js";

export interface SocketData {
  user: TokenPayload;
}

export interface ChatMessage {
  from: string;
  role: Role;
  text: string;
  date: string;
}

export interface MonumentCreated {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface ClientToServerEvents {
  "chat:send": (payload: { text: string }) => void;
}

export interface ServerToClientEvents {
  "chat:message": (message: ChatMessage) => void;
  "chat:error": (message: string) => void;
  "presence:update": (payload: { visitors: number; guides: number }) => void;
  "monument:created": (monument: MonumentCreated) => void;
}

export interface SocketData {
  user: TokenPayload;
  monumentId: number | null;
}