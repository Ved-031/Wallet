import { api } from '@/core/api/axios';
import { ActivityResponse } from '../types';

export const getActivity = async ({
    pageParam,
}: {
    pageParam?: string | null;
}): Promise<ActivityResponse> => {
    const { data } = await api.get('/dashboard/activity', {
        params: {
            cursor: pageParam,
            limit: 15,
        },
    });

    return data;
};
