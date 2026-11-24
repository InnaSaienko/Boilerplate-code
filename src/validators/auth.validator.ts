import {z} from "zod";

export const registerSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().trim().pipe(z.email()),
    password: z.string().min(6),
    name: z.string().min(2),
});

export const loginSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6),
});

export const refreshSchema = z.object({
        refreshToken: z.string().min(1)
});



export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
