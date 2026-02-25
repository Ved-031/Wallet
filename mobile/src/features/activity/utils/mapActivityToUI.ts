import { ActivityItem, ActivityUI } from '../types';

export const mapActivityToUI = (item: ActivityItem): ActivityUI => {
    return {
        id: item.id,
        title: item.title,
        amount: item.amount,
        type: item.type,
        direction: item.direction,
        createdAt: new Date(item.createdAt),
    };
};
