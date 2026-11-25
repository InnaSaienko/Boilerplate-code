import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.ts";

export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES = "7d";
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type TokenType = "access" | "refresh";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("Invalid JWT_SECRET");
}

export function generateAccessToken(userId: number) {
    return jwt.sign(
        {
            userId: String(userId),
            type: "access",
        },
        JWT_SECRET as string,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

}

export function generateRefreshToken(userId: number) {
    return jwt.sign(
        {
            userId: String(userId),
            type: "refresh",
        },
        JWT_SECRET as string,
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
export function verifyToken(token: string, expectedType: TokenType) {
    const payload =  jwt.verify(token, JWT_SECRET as string) as {
        userId: string;
        type?: string;
        iat?: number;
        exp?: number;
    };
    if (payload.type != expectedType) {
        throw new Error(`Invalid ${expectedType} token`);
    }
    return payload;
}

export function verifyAccessToken(token: string) {
    return verifyToken(token, "access");
}

export function verifyRefreshToken(token: string) {
    return verifyToken(token, "refresh");
}