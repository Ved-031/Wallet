import { api } from '@/core/api/axios';

export const renameGroup = async ({ groupId, name }: { groupId: number; name: string }) => {
    const { data } = await api.put(`/groups/${groupId}`, { name });

    return data.data;
};
