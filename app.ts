import express from "express";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import {errorHandler} from "./src/middleware/errorHandler.ts"
import authRoutes from "./src/routes/auth.routes.ts";
import {generateOpenApiDocument} from "./src/openapi.ts";
import swaggerUi from "swagger-ui-express";
import announceRouter from "./src/routes/announcments.routes.ts";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/announcements", announceRouter);
app.use(errorHandler);

const openApiDocument = generateOpenApiDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`,);
});
