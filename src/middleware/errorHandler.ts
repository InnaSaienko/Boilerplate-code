import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError.ts";

export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction) {
    if (err instanceof HttpError) {
        return res.status(err.status).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: "Internal server error" });
}