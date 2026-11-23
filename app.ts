import express from "express";
import type { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import {errorHandler} from "./src/middleware/errorHandler.ts"
import authRoutes from "./src/routes/auth.routes.ts";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`,);
});
