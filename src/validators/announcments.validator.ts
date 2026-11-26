import { z } from "zod";

export const querySchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["newest", "oldest"]).optional(),
  page: z.coerce.number().int().positive().optional(),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  category: z.enum(["sale", "service", "job", "other"]),
});

export type CreateAnnouncementBody = z.infer<typeof createAnnouncementSchema>;