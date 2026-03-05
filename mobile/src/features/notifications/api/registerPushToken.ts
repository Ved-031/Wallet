import { api } from '@/core/api/axios';

export const registerPushTokenApi = async (token: string) => {
    const { data } = await api.post('/notifications/push-token', {
        token,
    });

    return data;
};
