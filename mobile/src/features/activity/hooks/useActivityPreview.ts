import { api } from '@/core/api/axios';
import { useQuery } from '@tanstack/react-query';

export const useActivityPreview = () => {
    return useQuery({
        queryKey: ['activity-preview'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/activity?limit=5');
            return data;
        },
    });
};
