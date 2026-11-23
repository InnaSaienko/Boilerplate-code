import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function validate(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: err.flatten(),
        });
      }
      next(err);
    }
  };
}