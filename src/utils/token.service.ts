import jwt from "jsonwebtoken";

export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES = "7d";
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;


export function generateAccessToken(userId: string) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

}

export function generateRefreshToken(userId: string) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
}

export function verifyAccessToken(token: string) {
}

export function verifyRefreshToken(token: string) {
}