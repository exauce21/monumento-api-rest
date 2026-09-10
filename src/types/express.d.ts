import type { TokenPayload } from "../services/token.service.js";

declare global {
  namespace Express {
    interface Request {
      visit: number;
      user?: TokenPayload;
    }
  }
}
export {};