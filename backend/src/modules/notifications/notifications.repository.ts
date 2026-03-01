import { prisma } from '../../config/prisma';
import { NotificationType } from '@prisma/client';
import { serializeMessage, deserializeMessage } from '../../utils/NotificationMessage';

export const notificationsRepository = {
    async createNotification(
        userId: number,
        type: NotificationType,
        title: string,
        message: string,
        meta?: any,
    ) {
        return prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message: serializeMessage(message, meta),
            },
        });
    },

    async getUserNotifications(userId: number) {
        const rows = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return rows.map(n => {
            const parsed = deserializeMessage(n.message);
            return {
                ...n,
                message: parsed.message,
                meta: parsed.meta,
            };
        });
    },

    async markAsRead(notificationId: number, userId: number) {
        return prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: { read: true },
        });
    },

    async markAllAsRead(userId: number) {
        return prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    },
};
