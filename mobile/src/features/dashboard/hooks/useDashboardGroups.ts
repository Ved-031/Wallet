import { useQuery } from '@tanstack/react-query';
import { getGroupsPreview } from '../../groups/api/getGroupsPreview';

export const useDashboardGroups = () => {
    return useQuery({
        queryKey: ['dashboard-groups'],
        queryFn: getGroupsPreview,
        staleTime: 1000 * 60 * 3, // 3 minutes
    });
};
