export type SplitType = 'EQUAL' | 'EXACT' | 'PERCENT';

export type SplitInput = {
    userId: number;
    amount: number;
};

export type SplitMember = {
    userId: number;
    name: string;
    avatar?: string | null;
    value: number; // amount
}

export type CreateExpenseDto = {
    groupId: number;
    description: string;
    amount: number;
    paidBy: number;
    splitType: SplitType;
    splits: SplitInput[];
};
