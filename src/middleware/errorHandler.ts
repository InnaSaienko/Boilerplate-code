// Error handling middleware
import type {NextFunction, Request, Response} from "express";

export const errorHandler = ((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "Validation error occurred",
            details: {
                body: ["Invalid JSON format in request body"],
            },
        });
    }

    if (err.status && err.status >= 400 && err.status < 500) {
        return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
});