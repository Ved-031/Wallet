export type NotificationType =
    | 'GROUP_INVITE'
    | 'INVITE_ACCEPTED'
    | 'INVITE_DECLINED'
    | 'SETTLEMENT'
    | 'EXPENSE_ADDED'
    | 'GROUP_RENAMED'
    | 'MEMBER_REMOVED';

export type Notification = {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
    meta?: {
        actorName?: string;
        actorAvatar?: string;
        groupName?: string;
        inviteId?: number;
        amount?: number;
        groupId?: number;
    };
};
