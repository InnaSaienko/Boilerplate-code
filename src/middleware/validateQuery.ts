import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {querySchema} from "../validators/announcments.validator.ts";

export type QueryParams = z.infer<typeof querySchema>;

export function validateQuery(schema: z.ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues,
            });
        }

        res.locals.query = result.data as typeof req.query;
        next();
    };
}