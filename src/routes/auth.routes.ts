import { Router } from "express";

import { authenticate } from "../middleware/authenticate.ts";
import { validate } from "../middleware/validate.ts";
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

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", validate(refreshSchema), refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);

export default authRouter;