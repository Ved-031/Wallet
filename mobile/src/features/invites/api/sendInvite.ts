import { api } from '@/core/api/axios';

export const sendInvite = async ({ groupId, email }: { groupId: number; email: string }) => {
    const { data } = await api.post(`/invites/${groupId}`, { groupId, email });
    return data;
};
