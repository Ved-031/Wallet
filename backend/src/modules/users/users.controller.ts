import { prisma } from '../../config/prisma';
import type { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/AsyncHandler';
import { verifyToken } from '@clerk/backend';
import { clerk } from '../../config/clerk';

export const authCallback = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError('Missing authorization token', 401);
    }

    const token = authHeader.split(' ')[1];

    const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const clerkId = payload.sub;

    if (!clerkId) {
        throw new AppError('Invalid token', 401);
    }

    let user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
        const clerkUser = await clerk.users.getUser(clerkId);

        user = await prisma.user.create({
            data: {
                clerkId,
                name: clerkUser.firstName
                    ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
                    : clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User',
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                avatar: clerkUser.imageUrl,
            },
        });
    }

    res.status(200).json({
        success: true,
        message: 'Authenticated',
        user,
    });
});
