export type ActivityItem = {
    id: string;
    type: 'PERSONAL' | 'GROUP' | 'SETTLEMENT';
    title: string;
    amount: number;
    direction: 'in' | 'out';
    createdAt: Date;
};

export function mapTransactions(userId: number, transactions: any[]): ActivityItem[] {
    return transactions.map(t => ({
        id: `txn_${t.id}`,
        type: 'PERSONAL',
        title: `You ${t.type === 'EXPENSE' ? 'spent' : 'received'} ${t.title}`,
        amount: Number(t.amount),
        direction: t.type === 'EXPENSE' ? 'out' : 'in',
        createdAt: t.createdAt,
    }));
}

export function mapExpenses(userId: number, expenses: any[]): ActivityItem[] {
    return expenses.map(e => {
        const share = Number(e.participants[0]?.share || 0);
        const isPayer = e.payer.id === userId;

        return {
            id: `exp_${e.id}`,
            type: 'GROUP',
            title: isPayer
                ? `You added expense in ${e.group.name}`
                : `${e.payer.name} added expense`,
            amount: share,
            direction: isPayer ? 'in' : 'out',
            createdAt: e.createdAt,
        };
    });
}

export function mapSettlements(userId: number, settlements: any[]): ActivityItem[] {
    return settlements.map(s => {
        const isPayer = s.paidBy === userId;

        return {
            id: `set_${s.id}`,
            type: 'SETTLEMENT',
            title: isPayer ? `You paid ${s.receiver.name}` : `${s.payer.name} paid you`,
            amount: Number(s.amount),
            direction: isPayer ? 'out' : 'in',
            createdAt: s.createdAt,
        };
    });
}
