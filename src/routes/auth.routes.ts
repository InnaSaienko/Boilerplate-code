import { Router } from "express";
import { authenticate } from "../middleware/authenticate.ts";
import { validateBody } from "../middleware/validateBody.ts";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../validators/auth.validator.ts";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth.controller.ts";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/refresh", validateBody(refreshSchema), refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);

export default authRouter;