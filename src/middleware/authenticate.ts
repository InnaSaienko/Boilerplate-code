import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {HttpError} from "../utils/httpError.ts";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Unauthorized"));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = payload;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}