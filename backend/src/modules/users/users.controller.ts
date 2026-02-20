import { clerk } from '../../config/clerk';
import { prisma } from '../../config/prisma';
import { verifyToken } from '@clerk/backend';
import { AppError } from '../../utils/AppError';
import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/AsyncHandler';
import { verifyWebhook } from '@clerk/express/webhooks';

/**
 * @swagger
 * /user/callback:
 *   post:
 *     summary: Sync logged-in Clerk user with database
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User synced successfully
 *       401:
 *         description: Unauthenticated
 */
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

/**
 * @swagger
 * /user/clerk:
 *   post:
 *     summary: Sync logged-in Clerk user with database
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User synced successfully
 *       401:
 *         description: Unauthenticated
 */
export const clerkWebhook = asyncHandler(async (req: Request, res: Response) => {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;

    try {
        if (eventType === 'user.created' || eventType === 'user.updated') {
            const userData = {
                clerkId: evt.data.id,
                name: evt.data.first_name + ' ' + evt.data.last_name,
                email: evt.data?.email_addresses[0]?.email_address,
                avatar: evt.data?.image_url,
            };

            await prisma.user.upsert({
                where: {
                    clerkId: evt.data.id,
                },
                update: userData,
                create: userData,
            });
        }

        if (eventType === 'user.deleted') {
            await prisma.user
                .delete({
                    where: {
                        clerkId: evt.data.id,
                    },
                })
                .catch(() => null);
        }
    } catch (error) {
        console.error('Webhook error', error);
    }

    return res.status(200).json({
        success: true,
    });
});
