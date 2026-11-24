import type {NextFunction, Request, Response} from "express";
import prisma from "../../prisma/client.ts";
import bcrypt from "bcrypt";
import {
    createRefreshToken,
    generateAccessToken,
} from "../utils/token.service.ts";
import {asyncHandler} from "../utils/asyncHandler.ts";
import {HttpError} from "../utils/httpError.ts";

export const register = asyncHandler(async (req, res) => {
    const {username, email, password, name} = req.body;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{username}, {email}],
        },
    });

    if (existingUser) {
        throw new HttpError(409, "Username or email already taken");
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
    const refreshToken = await createRefreshToken(user.id);

    res.status(201).json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
        },
        accessToken,
        refreshToken,
    });

})

export const login = asyncHandler(async (req, res) => {
    const {username, password} = req.body;
    const user = await prisma.user.findUnique({where: {username}});

    if (!user) {
        throw new HttpError(401, "Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new HttpError(401, "Invalid credentials");
    }

    await prisma.refreshToken.deleteMany({
        where: {userId: user.id},
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);

    res.status(200).json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
        },
        accessToken,
        refreshToken,
    })
})

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