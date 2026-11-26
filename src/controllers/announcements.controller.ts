import {asyncHandler} from "../utils/asyncHandler.ts";
import type {Request, Response} from "express";
import prisma from "../../prisma/client.ts";
import {HttpError} from "../utils/httpError.ts";
import {CreateAnnouncementBody} from "../validators/announcments.validator.ts";
import {QueryParams} from "../middleware/validateQuery.ts";


export const getAnnouncements = asyncHandler( async (req: Request, res: Response) => {
    const query = res.locals.query as QueryParams;
    const search = query.search?.trim();
    const sort = query.sort === "oldest" ? "asc" : "desc";
    const page = query.page ?? 1;
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

export const createAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.userId) {
        throw new HttpError(401, "Unauthorized");
    }

    const { title, description, price, category } = req.body as CreateAnnouncementBody;

    const announcement = await prisma.announcement.create({
        data: {
            title,
            description,
            price,
            category,
            userId: Number(req.user.userId),
        },
        include: {
            user: {
                select: { id: true, username: true, email: true, name: true },
            },
        },
    });

    res.status(201).json(announcement);
});