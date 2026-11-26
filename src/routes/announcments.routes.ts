import { Router } from "express";
import { querySchema } from "../validators/announcments.validator.ts";
import { getAnnouncements } from "../controllers/announcements.controller.ts";
import {validateQuery} from "../middleware/validateQuery.ts";

const announceRouter = Router();

announceRouter.get("/", validateQuery(querySchema), getAnnouncements);

export default announceRouter;