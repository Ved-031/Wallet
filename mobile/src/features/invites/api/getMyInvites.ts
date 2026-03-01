import { api } from '@/core/api/axios';

export const getMyInvites = async () => {
    const { data } = await api.get('/invites');
    return data.data;
};
