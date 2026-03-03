import { api } from '@/core/api/axios';

export const getGroupActivity = async ({
    groupId,
    cursor,
}: {
    groupId: number;
    cursor?: string;
}) => {
    const { data } = await api.get(`/groups/${groupId}/activity`, {
        params: { cursor },
    });

    return data;
};
