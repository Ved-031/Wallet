import { api } from '@/core/api/axios';

export const getGroupSettlements = async (groupId: number) => {
    const { data } = await api.get(`/balance/group/${groupId}/settlements`);
    return data.data;
};
