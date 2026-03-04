import type { Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { notificationsService } from './notifications.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications list
 */
export const getMyNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const notifications = await notificationsService.getMyNotifications(userId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: notifications,
        }),
    );
});

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
export const markNotificationRead = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id;
        const id = Number(req.params.id);

        const result = await notificationsService.markAsRead(userId, id);

        res.status(200).json(
            new ApiResponse({
                success: true,
                ...result,
            }),
        );
    },
);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
export const markAllNotificationsRead = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id;

        const result = await notificationsService.markAllAsRead(userId);

        res.status(200).json(
            new ApiResponse({
                success: true,
                ...result,
            }),
        );
    },
);

/**
 * @swagger
 * /notifications/push-token:
 *   post:
 *     summary: Register push token
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Push token registered
 */
export const registerPushToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { token } = req.body;

    const result = await notificationsService.registerPushToken(userId, token);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: result,
        }),
    );
});

/**
 * @swagger
 * /notifications/disable:
 *   post:
 *     summary: Disable push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Push notifications disabled
 */
export const disablePush = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const result = await notificationsService.disablePush(userId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            ...result,
        }),
    );
});

/**
 * @swagger
 * /notifications/toggle:
 *   post:
 *     summary: Toggle push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Push notifications toggled
 */
export const togglePush = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { enabled } = req.body;

    const result = await notificationsService.togglePush(userId, enabled);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: result,
        }),
    );
});
