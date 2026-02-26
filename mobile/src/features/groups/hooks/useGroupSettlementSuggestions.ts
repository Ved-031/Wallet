import { api } from '@/core/api/axios';
import { useQuery } from '@tanstack/react-query';
import { SettlementSuggestion } from '../types';

export const useGroupSettlementSuggestions = (groupId: number) => {
    return useQuery({
        queryKey: ['group-settlement-suggestions', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/balance/group/${groupId}/settlements`);
            return data.data as SettlementSuggestion[];
        },
    });
};
