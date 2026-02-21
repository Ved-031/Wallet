import { ActivityResponse } from '../types';
import { getActivity } from '../api/getActivity';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useActivity = () => {
    return useInfiniteQuery({
        queryKey: ['dashboard-activity'],
        queryFn: ({ pageParam = null }) => getActivity({ pageParam }),
        initialPageParam: null,
        getNextPageParam: lastPage =>
            lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined,
    });
};
