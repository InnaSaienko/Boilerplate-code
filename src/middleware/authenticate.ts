import type {NextFunction, Request, Response} from "express";
import {HttpError} from "../utils/httpError.ts";
import {verifyAccessToken} from "../utils/token.service.ts";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new HttpError(401, "Unauthorized"));
    }

    const token = authHeader.slice(7);

    try {
        req.user = verifyAccessToken(token);
        next();

    } catch {
        next(new HttpError(401, "Invalid or expired token"));
    }
}