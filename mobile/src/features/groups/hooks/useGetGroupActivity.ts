import { useInfiniteQuery } from '@tanstack/react-query';
import { getGroupActivity } from '../api/getGroupActivity';

export const useGetGroupActivity = (groupId: number) => {
    return useInfiniteQuery({
        queryKey: ['group-activity', groupId],
        queryFn: ({ pageParam }) =>
            getGroupActivity({
                groupId,
                cursor: pageParam as string | undefined,
            }),
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.meta?.nextCursor ?? undefined,
    });
};
