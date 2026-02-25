import { GroupExpense } from './types';
import dayjs from '@/shared/utils/dayjs';

export type GroupExpenseUI = {
    id: number;
    title: string;
    subtitle: string;
    amount: number;
    direction: 'in' | 'out' | 'neutral';
    avatar?: string;
};

export const mapGroupExpenseToUI = (
    expense: GroupExpense,
    currentUserId: number,
): GroupExpenseUI => {
    const myShare = expense.participants.find(p => p.userId === currentUserId);
    const isPayer = expense.paidBy === currentUserId;

    const share = Number(myShare?.share ?? 0);

    // I paid → others owe me
    if (isPayer) {
        return {
            id: expense.id,
            title: `You paid for ${expense.description}`,
            subtitle: dayjs(expense.createdAt).fromNow(),
            amount: share,
            direction: share === 0 ? 'neutral' : 'in',
            avatar: expense.payer.avatar,
        };
    }

    // Someone else paid → I owe
    return {
        id: expense.id,
        title: `${expense.payer.name} paid for ${expense.description}`,
        subtitle: dayjs(expense.createdAt).fromNow(),
        amount: share,
        direction: share === 0 ? 'neutral' : 'out',
        avatar: expense.payer.avatar,
    };
};
