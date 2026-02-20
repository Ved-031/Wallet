import { prisma } from '../config/prisma';
import { verifyToken } from '@clerk/backend';
import { asyncHandler } from '../utils/AsyncHandler';
import type { Request, Response, NextFunction } from 'express';

export type AuthenticatedRequest = Request & {
    user?: {
        id: number;
        clerkId: string;
    };
};

export const protectRoute = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Missing authorization token' });
        }

        const token = authHeader.split(' ')[1];

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
        });

        const clerkId = payload.sub;

        if (!clerkId) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        let user = await prisma.user.findUnique({ where: { clerkId } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    clerkId,
                    email: (payload as any).email,
                    name: (payload as any).fullName,
                    avatar: (payload as any).imageUrl ?? null,
                }
            })
        }

        req.user = {
            id: user.id,
            clerkId,
        };

        next();
    },
);
