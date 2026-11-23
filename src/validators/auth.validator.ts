import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30),
    email: z.string().trim().pipe(z.email()),
    password: z.string().min(6),
    name: z.string().min(2),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().pipe(z.email()),
    password: z.string().min(6),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});