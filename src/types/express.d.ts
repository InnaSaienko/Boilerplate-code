
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                type?: string;
                iat?: number;
                exp?: number;
            };
        }
    }
}

export {};