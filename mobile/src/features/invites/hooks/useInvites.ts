import { useQuery } from '@tanstack/react-query';
import { getMyInvites } from '../api/getMyInvites';

export const useInvites = () => {
    return useQuery({
        queryKey: ['invites'],
        queryFn: getMyInvites,
    });
};
