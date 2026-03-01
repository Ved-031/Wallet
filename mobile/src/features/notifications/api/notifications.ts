import { api } from '@/core/api/axios';
import { Notification } from '../types';

export const getNotifications = async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications');
    return data.data;
};

export const markAsRead = async (id: number) => {
    await api.patch(`/notifications/${id}/read`);
};

export const markAllRead = async () => {
    await api.patch('/notifications/read-all');
};
