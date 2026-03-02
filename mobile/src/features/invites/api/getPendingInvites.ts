import { api } from '@/core/api/axios';

export const getPendingInvites = async (groupId: number) => {
    const { data } = await api.get(`/invites/${groupId}/pending-invites`);
    return data.data;
};
