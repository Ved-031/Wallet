import { api } from '@/core/api/axios';
import { GroupPreview } from '../../dashboard/types';

export const getGroupsPreview = async (): Promise<GroupPreview[]> => {
    const { data } = await api.get('/dashboard/groups-preview');
    return data.data as GroupPreview[];
};
