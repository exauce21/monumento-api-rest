import type { RequestHandler } from "express";
let visits = 0;

export const visitCounter: RequestHandler = (req, res, next) => {
  req.visit = ++visits;
  res.setHeader("X-Visit", req.visit);
  next();
};