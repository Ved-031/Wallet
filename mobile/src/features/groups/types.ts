export type GroupPreview= {
    id: string;
    name: string;
    balance: number;
    youOwe: number;
    youAreOwed: number;
    memberAvatars: string[];
    isSettled: boolean;
    createdAt: string;
}

export type GroupRole = 'ADMIN' | 'MEMBER';

export type Group = {
    id: number;
    name: string;
    createdBy: number;
    members: {
        userId: number;
        groupId: number;
        role: GroupRole;
        user: {
            id: number;
            name: string;
            email: string;
            avatar: string;
        }
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export type GroupExpense = {
    id: number;
    groupId: number;
    paidBy: number;
    description: string;
    amount: string;
    payer: {
        id: number;
        name: string;
        email: string;
        avatar: string;
    };
    participants: {
        expenseId: number;
        userId: number;
        share: string;
        paidShare: string;
        user: {
            id: number;
            name: string;
            email: string;
            avatar: string;
        }
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export type GroupExpenseApiRes = {
    data: GroupExpense[];
    meta: {
        hasMore: boolean;
        nextCursor?: string | null;
    };
    success: boolean;
}
