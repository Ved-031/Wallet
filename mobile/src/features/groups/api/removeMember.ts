import { api } from '@/core/api/axios';

export const removeMember = async ({ groupId, userId }: { groupId: number; userId: number }) => {
    const { data } = await api.delete(`/groups/${groupId}/members/${userId}`);
    return data;
};
