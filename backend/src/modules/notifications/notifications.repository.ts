import { prisma } from '../../config/prisma';

export const notificationsRepository = {
    async getUserNotifications(userId: number) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
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
