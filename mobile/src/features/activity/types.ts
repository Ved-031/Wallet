export type ActivityDirection = 'in' | 'out';
export type ActivityType = 'PERSONAL' | 'GROUP' | 'SETTLEMENT';
export type ActivityFilter = 'ALL' | ActivityType;

export type ActivityUI = {
    id: string;
    title: string;
    amount?: number;
    type: ActivityType;
    direction?: ActivityDirection;
    createdAt: Date;
};

export type ActivityItem = {
    id: string;
    type: ActivityType;
    title: string;
    subtitle?: string;
    amount: number;
    createdAt: Date;
    groupName?: string;
    avatar?: string | null;
    direction?: ActivityDirection;
};

export type ActivityResponse = {
    data: ActivityItem[];
    meta: {
        nextCursor?: string | null;
        hasMore: boolean;
    };
};
