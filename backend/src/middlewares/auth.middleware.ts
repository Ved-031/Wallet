import { prisma } from '../config/prisma.ts';
import { getAuth, requireAuth } from '@clerk/express';
import { asyncHandler } from '../utils/AsyncHandler.ts';
import type { Request, Response, NextFunction } from 'express';

export type AuthenticatedRequest = Request & {
    user?: {
        id: number;
        clerkId: string;
    };
};

export const protectRoute = [
    requireAuth(),
    asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userId: clerkId } = getAuth(req);
        if (!clerkId) {
            return res.status(401).json({ message: 'Unauthenticated' });
        }

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return res.status(401).json({ message: 'User not synced yet. Please retry.' });
        }

        req.user = {
            id: user.id,
            clerkId,
        };

        next();
    }),
];
