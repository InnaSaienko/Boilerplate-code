import {asyncHandler} from "../utils/asyncHandler.ts";
import type {Request, Response} from "express";
import prisma from "../../prisma/client.ts";

export const getAnnouncements = asyncHandler( async (req: Request, res: Response) => {
    const search = (req.query.search as string | undefined)?.trim();
    const sort = req.query.sort === "oldest" ? "asc" : "desc";
    const page = Number(req.query.page) || 1;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const where = search
        ? { title: { contains: search, mode: "insensitive" as const } }
        : {};

    const [data, total] = await Promise.all([
        prisma.announcement.findMany({
            where,
            orderBy: { createdAt: sort },
            skip,
            take: perPage,
            include: {
                user: {
                    select: { id: true, username: true, email: true, name: true },
                },
            },
        }),
        prisma.announcement.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    res.status(200).json({
        data,
        pagination: {
            total,
            page,
            totalPages,
            perPage,
        },
    });

});