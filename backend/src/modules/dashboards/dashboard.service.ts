import { getMonthRange } from '../../utils/utils';
import { mapExpenses, mapSettlements, mapTransactions } from './activity.mapper';
import { dashboardRepository } from './dashboard.repository';

function calculateDebts(userId: number, expenses: any[], settlements: any[]) {
    const balances: Record<number, number> = {};

    // ----- Expenses -----
    for (const expense of expenses) {
        const payerId = expense.payer.id;

        for (const p of expense.participants) {
            if (p.userId === payerId) continue;

            // only calculate for current user relations
            if (payerId === userId) {
                // others owe you
                balances[p.userId] = (balances[p.userId] || 0) + Number(p.share);
            }

            if (p.userId === userId) {
                // you owe payer
                balances[payerId] = (balances[payerId] || 0) - Number(p.share);
            }
        }
    }

    // ----- Settlements -----
    for (const s of settlements) {
        const amount = Number(s.amount);

        if (s.paidBy === userId) {
            balances[s.paidTo] = (balances[s.paidTo] || 0) + amount;
        }

        if (s.paidTo === userId) {
            balances[s.paidBy] = (balances[s.paidBy] || 0) - amount;
        }
    }

    let youOwe = 0;
    let youAreOwed = 0;

    for (const val of Object.values(balances)) {
        if (val < 0) youOwe += Math.abs(val);
        else youAreOwed += val;
    }

    return { youOwe, youAreOwed };
}

function calculateDebtBreakdown(userId: number, expenses: any[], settlements: any[]) {
    const balances: Record<number, { name: string; amount: number }> = {};

    // Expenses
    for (const expense of expenses) {
        const payer = expense.payer;

        for (const p of expense.participants) {
            if (p.userId === payer.id) continue;

            if (payer.id === userId) {
                const u = p.user;
                balances[u.id] = {
                    name: u.name,
                    amount: (balances[u.id]?.amount || 0) + Number(p.share),
                };
            }

            if (p.userId === userId) {
                balances[payer.id] = {
                    name: payer.name,
                    amount: (balances[payer.id]?.amount || 0) - Number(p.share),
                };
            }
        }
    }

    // Settlements
    for (const s of settlements) {
        const amount = Number(s.amount);

        if (s.paidBy === userId) {
            const u = s.receiver;
            balances[u.id] = {
                name: u.name,
                amount: (balances[u.id]?.amount || 0) + amount,
            };
        }

        if (s.paidTo === userId) {
            const u = s.payer;
            balances[u.id] = {
                name: u.name,
                amount: (balances[u.id]?.amount || 0) - amount,
            };
        }
    }

    const owe = [];
    const owed = [];

    for (const [id, val] of Object.entries(balances)) {
        if (Math.abs(val.amount) < 0.01) continue;

        if (val.amount < 0)
            owe.push({ userId: Number(id), name: val.name, amount: Math.abs(val.amount) });
        else owed.push({ userId: Number(id), name: val.name, amount: val.amount });
    }

    return { owe, owed };
}

export const dashboardService = {
    async getSummary(userId: number) {
        const { start, end } = getMonthRange();

        const [personalBalance, activeGroups, personalMonth, groupMonth, expenses, settlements] =
            await Promise.all([
                dashboardRepository.getPersonalBalance(userId),
                dashboardRepository.getActiveGroupsCount(userId),
                dashboardRepository.getPersonalMonthlyExpense(userId, start, end),
                dashboardRepository.getGroupMonthlyExpense(userId, start, end),
                dashboardRepository.getAllGroupExpenses(userId),
                dashboardRepository.getAllSettlements(userId),
            ]);

        // debt math
        const { youOwe, youAreOwed } = calculateDebts(userId, expenses, settlements);

        const totalExpensesThisMonth = personalMonth + groupMonth;

        const netBalance = personalBalance + youAreOwed - youOwe;

        return {
            netBalance,
            youOwe,
            youAreOwed,
            personalBalance,
            activeGroups,
            totalExpensesThisMonth,
        };
    },

    async getDebts(userId: number) {
        const [expenses, settlements] = await Promise.all([
            dashboardRepository.getAllGroupExpensesDetailed(userId),
            dashboardRepository.getAllSettlementsDetailed(userId),
        ]);

        return calculateDebtBreakdown(userId, expenses, settlements);
    },

    async getActivity(userId: number, query: any) {
        const limit = Math.min(Number(query.limit) || 20, 50);
        const cursor = query.cursor ? new Date(query.cursor) : undefined;

        const [transactions, expenses, settlements] = await Promise.all([
            dashboardRepository.getUserTransactions(userId, cursor, limit),
            dashboardRepository.getUserExpenses(userId, cursor, limit),
            dashboardRepository.getUserSettlements(userId, cursor, limit),
        ]);

        const feed = [
            ...mapTransactions(userId, transactions),
            ...mapExpenses(userId, expenses),
            ...mapSettlements(userId, settlements),
        ];

        // SORT GLOBAL TIMELINE
        feed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const sliced = feed.slice(0, limit);
        const last = sliced[sliced.length - 1];

        return {
            activity: sliced,
            nextCursor: last?.createdAt ?? null,
            hasMore: feed.length > limit,
        };
    },

    async getGroupsPreview(userId: number) {
        const groups = await dashboardRepository.getGroupsPreview(userId);

        return groups.map(g => ({
            id: g.id,
            name: g.name,
            memberAvatars: g.memberAvatars,
            balance: g.balance,
            youOwe: Math.max(0, -g.balance),
            youAreOwed: Math.max(0, g.balance),
            isSettled: g.balance === 0,
        }));
    },
};
