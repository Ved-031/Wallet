import { useQuery } from '@tanstack/react-query';
import { getPendingInvites } from '../api/getPendingInvites';

export const useGroupInvites = (groupId: number) => {
    return useQuery({
        queryKey: ['group-invites', groupId],
        queryFn: () => getPendingInvites(groupId),
    });
};
