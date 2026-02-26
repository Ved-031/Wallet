import { api } from '@/core/api/axios';
import { GroupBalance } from '../types';
import { useQuery } from '@tanstack/react-query';

export const useGroupBalances = (groupId: number) => {
    return useQuery({
        queryKey: ['group-balances', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/balance/group/${groupId}`);
            return data.data as GroupBalance[];
        },
    });
};
