import type {NextFunction, Request, Response} from "express";
import {RegisterBody} from "../validators/auth.validator.ts";
import prisma from "../../prisma/client.ts";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken, REFRESH_TOKEN_TTL_MS} from "../utils/token.service.ts";

export async function register(req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) {
    try {
        const {username, email, password, name} = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{username}, {email}],
            },
        });

        if (existingUser) {
            return res.status(409).json({error: "Username or email already taken"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                name,
            },
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id)

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
            },
        });


        return res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
            },
            accessToken,
            refreshToken,
        });
    } catch (e) {
        next(e);
    }
};

export async function login(req: Request, res: Response, next: NextFunction) {
    // TODO: verify credentials, generate access + refresh tokens
    return res.status(501).json({error: "Not implemented"});
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    // TODO: verify refresh token, rotate tokens
    return res.status(501).json({error: "Not implemented"});
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    // TODO: invalidate refresh token
    return res.status(501).json({error: "Not implemented"});
}

export async function me(req: Request, res: Response, next: NextFunction) {
    // TODO: return current authenticated user
    return res.status(501).json({error: "Not implemented"});
}