import { notificationsRepository } from './notifications.repository';

export const notificationsService = {
    async getMyNotifications(userId: number) {
        return notificationsRepository.getUserNotifications(userId);
    },

    async markAsRead(userId: number, notificationId: number) {
        await notificationsRepository.markAsRead(notificationId, userId);
        return { message: 'Notification marked as read' };
    },

    async markAllAsRead(userId: number) {
        await notificationsRepository.markAllAsRead(userId);
        return { message: 'All notifications marked as read' };
    },
};
