import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.ts";

export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES = "7d";
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;


export function generateAccessToken(userId: number) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

}

export function generateRefreshToken(userId: number) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
}

export async function createRefreshToken(userId: number) {
    const token = generateRefreshToken(userId);
    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
    });
    return token;
}
export function verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: number;
        iat?: number;
        exp?: number;
    };
}

export const verifyAccessToken = verifyToken;
export const verifyRefreshToken = verifyToken;