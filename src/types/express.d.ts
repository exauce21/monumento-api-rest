declare global {
  namespace Express {
    interface Request { visit: number }
  }
}
export {};