export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export type InviteRaw = {
    id: number;
    groupId: number;
    invitedBy: number;
    invitedUserId: number;
    status: InviteStatus;
    createdAt: string;
    group: {
        id: number;
        name: string;
    };
    inviter: {
        id: number;
        name: string;
        email: string;
        avatar?: string | null;
    };
}

export type InviteUI = {
    id: number;
    groupId: number;
    groupName: string;
    invitedBy: {
        id: number;
        name: string;
        avatar?: string | null;
    }
    createdAt: string;
}
