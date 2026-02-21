import dayjs from '@/shared/utils/dayjs';
import { ActivityItem } from '../types';

export type ActivitySection = {
    title: string;
    data: ActivityItem[];
}

export const groupActivitiesByMonth = (activities: ActivityItem[]): ActivitySection[] => {
    const map = new Map<string, ActivityItem[]>();

    activities.forEach(a => {
        const key = dayjs(a.createdAt).format('MMMM-YYYY');
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(a);
    });

    return Array.from(map.entries()).map(([title, data]) => ({
        title,
        data,
    }));
}
