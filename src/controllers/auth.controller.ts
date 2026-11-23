import type { NextFunction, Request, Response } from "express";

export async function register(req: Request, res: Response, next: NextFunction) {
  // TODO: validate input, hash password, create user, generate tokens
  return res.status(501).json({ error: "Not implemented" });
}

export async function login(req: Request, res: Response, next: NextFunction) {
  // TODO: verify credentials, generate access + refresh tokens
  return res.status(501).json({ error: "Not implemented" });
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  // TODO: verify refresh token, rotate tokens
  return res.status(501).json({ error: "Not implemented" });
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  // TODO: invalidate refresh token
  return res.status(501).json({ error: "Not implemented" });
}

export async function me(req: Request, res: Response, next: NextFunction) {
  // TODO: return current authenticated user
  return res.status(501).json({ error: "Not implemented" });
}