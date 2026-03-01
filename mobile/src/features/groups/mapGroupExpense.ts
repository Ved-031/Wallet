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
    const participant = expense.participants.find(p => p.userId === currentUserId);

    const paid = Number(participant?.paidShare ?? 0);
    const owed = Number(participant?.share ?? 0);

    const delta = Number((paid - owed).toFixed(2));

    let direction: 'in' | 'out' | 'neutral' = 'neutral';

    if (delta > 0) direction = 'in';
    else if (delta < 0) direction = 'out';

    const absAmount = Math.abs(delta);

    const isPayer = expense.paidBy === currentUserId;

    return {
        id: expense.id,
        title: isPayer
            ? `You paid for ${expense.description}`
            : `${expense.payer.name} paid for ${expense.description}`,
        subtitle: dayjs(expense.createdAt).fromNow(),
        amount: absAmount,
        direction,
        avatar: expense.payer.avatar,
    }
};
