import { prisma } from '../../config/prisma';
import type { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { clerkClient, getAuth } from '@clerk/express';
import { asyncHandler } from '../../utils/AsyncHandler';

export const authCallback = asyncHandler(async (req: Request, res: Response) => {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
        throw new AppError("Unauthenticated", 401);
    }

    let user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkId);

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
