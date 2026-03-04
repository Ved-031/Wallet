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

    async registerPushToken(userId: number, token: string) {
        if (!token) {
            throw new Error('Push token is required');
        }

        return notificationsRepository.savePushToken(userId, token);
    },

    async disablePush(userId: number) {
        await notificationsRepository.removePushToken(userId);
        return { message: 'Push notifications disabled' };
    },

    async togglePush(userId: number, enabled: boolean) {
        return notificationsRepository.updatePushPreference(userId, enabled);
    },
};
