import { api } from '@/core/api/axios';

export const leaveGroup = async (groupId: number) => {
    const { data } = await api.post(`/groups/${groupId}/leave`);
    return data;
};
