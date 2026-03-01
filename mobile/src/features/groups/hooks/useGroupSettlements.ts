import { useQuery } from '@tanstack/react-query';
import { getGroupSettlements } from '../api/getGroupSettlements';

export const useGroupSettlements = (groupId: number) => {
    return useQuery({
        queryKey: ['group-settlements', groupId],
        queryFn: () => getGroupSettlements(groupId),
        enabled: !!groupId,
    });
};
