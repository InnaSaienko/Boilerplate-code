import prisma from "../../prisma/client.ts";
import bcrypt from "bcrypt";
import {
    createRefreshToken,
    generateAccessToken, verifyRefreshToken,
} from "../utils/token.service.ts";
import {asyncHandler} from "../utils/asyncHandler.ts";
import {HttpError} from "../utils/httpError.ts";
import {LoginBody, RefreshInput, RegisterBody} from "../validators/auth.validator.ts";

export const register = asyncHandler(async (req, res) => {
    const {username, email, password, name} = req.body as RegisterBody;

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
    const {username, password} = req.body as LoginBody;
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

export const refresh = asyncHandler(async (req, res) => {
    const {refreshToken} = req.body as RefreshInput;

    let payload: { userId: string };

    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        throw new HttpError(401, "Invalid or expired refresh token");
    }

    const storedToken = await prisma.refreshToken.findUnique({
        where: {token: refreshToken},
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new HttpError(401, "Invalid or expired refresh token");
    }

    await prisma.refreshToken.delete({
        where: {id: storedToken.id},
    });

    const user = await prisma.user.findUnique({
        where: {id: Number(payload.userId)},
        select: {id: true, username: true, email: true, name: true},
    });

    if (!user) {
        throw new HttpError(401, "Invalid or expired refresh token");
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = await createRefreshToken(user.id);

    res.status(200).json({
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    });
})

export const logout = asyncHandler(async (req, res) => {
    const {refreshToken} = req.body  as {refreshToken?: string};

    if (refreshToken) {
        await prisma.refreshToken.deleteMany({
            where: {token: refreshToken},
        });
    }

    res.status(204).send();

})

export const me = asyncHandler(async (req, _res) => {
    if (!req.user?.userId) {
        throw new HttpError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: {id: Number(req.user.userId)},
        select: {
            id: true,
            username: true,
            email: true,
            name: true,
        },
    });

    if (!user) {
        throw new HttpError(404, "User not found");
    }
})