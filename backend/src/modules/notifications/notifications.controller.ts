import type { Response } from 'express';
import { asyncHandler } from '../../utils/AsyncHandler';
import { notificationsService } from './notifications.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const getMyNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const notifications = await notificationsService.getMyNotifications(userId);

    res.status(200).json({
        success: true,
        data: notifications,
    });
});

export const markNotificationRead = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id;
        const id = Number(req.params.id);

        const result = await notificationsService.markAsRead(userId, id);

        res.status(200).json({
            success: true,
            ...result,
        });
    },
);

export const markAllNotificationsRead = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id;

        const result = await notificationsService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            ...result,
        });
    },
);
