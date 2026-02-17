import { prisma } from '../config/prisma';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const idempotencyMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    const key = req.headers['idempotency-key'] as string;

    if (!key) return next();

    const existing = await prisma.idempotencyKey.findUnique({
        where: { key },
    });

    if (existing?.response) {
        return res.status(200).json(existing.response);
    }

    res.locals.idempotencyKey = key;
    next();
};
