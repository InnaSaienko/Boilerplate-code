import { Router } from "express";
import {createAnnouncementSchema, querySchema} from "../validators/announcments.validator.ts";
import {createAnnouncement, getAnnouncements} from "../controllers/announcements.controller.ts";
import {validateQuery} from "../middleware/validateQuery.ts";
import {authenticate} from "../middleware/authenticate.ts";
import {validateBody} from "../middleware/validateBody.ts";

const announceRouter = Router();

announceRouter.get("/", validateQuery(querySchema), getAnnouncements);
announceRouter.post("/", authenticate, validateBody(createAnnouncementSchema), createAnnouncement);

export default announceRouter;