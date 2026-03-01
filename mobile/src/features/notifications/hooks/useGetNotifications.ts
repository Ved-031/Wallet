import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../api/notifications';

export const useGetNotifications = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
};
