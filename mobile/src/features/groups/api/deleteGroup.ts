import { api } from '@/core/api/axios';

export const deleteGroup = async (groupId: number) => {
    const { data } = await api.delete(`/groups/${groupId}`);
    return data;
};
