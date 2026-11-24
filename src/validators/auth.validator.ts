import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const registerSchema = z.object({
    username: z.string().min(3).max(30).openapi({example: "Taras Petrikivka"}),
    email: z.string().trim().pipe(z.email()).openapi({ format: "email", example: "taras@example.com" }),
    password: z.string().min(6).openapi({ example: "password123" }),
    name: z.string().trim().min(2).openapi({ example: "Taras Petrikivka" }),
});

export const loginSchema = z.object({
    username: z.string().min(3).max(30).openapi({example: "Taras Petrikivka"}),
    password: z.string().min(6).openapi({ example: "password123" }),
});

export const refreshSchema = z.object({
        refreshToken: z.string().min(1).openapi({ example: " eyJhbGciOiJIUz..." }),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
