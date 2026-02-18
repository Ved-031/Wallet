import { prisma } from '../../config/prisma';

export const dashboardRepository = {
    async getPersonalBalance(userId: number) {
        const result = await prisma.transaction.groupBy({
            by: ['type'],
            where: { userId },
            _sum: { amount: true },
        });

        let income = 0;
        let expense = 0;

        for (const row of result) {
            if (row.type === 'INCOME') income = Number(row._sum.amount || 0);
            else expense = Number(row._sum.amount || 0);
        }

        return income - expense;
    },

    async getActiveGroupsCount(userId: number) {
        return prisma.groupMember.count({
            where: { userId },
        });
    },

    async getPersonalMonthlyExpense(userId: number, start: Date, end: Date) {
        const result = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'EXPENSE',
                createdAt: { gte: start, lte: end },
            },
            _sum: { amount: true },
        });

        return Number(result._sum.amount || 0);
    },

    async getGroupMonthlyExpense(userId: number, start: Date, end: Date) {
        const result = await prisma.expenseParticipant.aggregate({
            where: {
                userId,
                expense: {
                    createdAt: { gte: start, lte: end },
                },
            },
            _sum: { share: true },
        });

        return Number(result._sum.share || 0);
    },

    async getAllGroupExpenses(userId: number) {
        return prisma.expense.findMany({
            where: {
                group: {
                    members: {
                        some: { userId },
                    },
                },
            },
            include: {
                payer: { select: { id: true } },
                participants: {
                    select: {
                        userId: true,
                        share: true,
                    },
                },
            },
        });
    },

    async getAllSettlements(userId: number) {
        return prisma.settlement.findMany({
            where: {
                OR: [{ paidBy: userId }, { paidTo: userId }],
            },
            select: {
                paidBy: true,
                paidTo: true,
                amount: true,
            },
        });
    },

    async getAllGroupExpensesDetailed(userId: number) {
        return prisma.expense.findMany({
            where: {
                group: {
                    members: {
                        some: { userId },
                    },
                },
            },
            include: {
                payer: {
                    select: { id: true, name: true, avatar: true },
                },
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatar: true },
                        },
                    },
                },
            },
        });
    },

    async getAllSettlementsDetailed(userId: number) {
        return prisma.settlement.findMany({
            where: {
                OR: [{ paidBy: userId }, { paidTo: userId }],
            },
            include: {
                payer: { select: { id: true, name: true, avatar: true } },
                receiver: { select: { id: true, name: true, avatar: true } },
            },
        });
    },

    async getUserTransactions(userId: number, cursor?: Date, limit = 20) {
        return prisma.transaction.findMany({
            where: {
                userId,
                ...(cursor && { createdAt: { lt: cursor } }),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },

    async getUserExpenses(userId: number, cursor?: Date, limit = 20) {
        return prisma.expense.findMany({
            where: {
                group: { members: { some: { userId } } },
                ...(cursor && { createdAt: { lt: cursor } }),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                group: { select: { name: true } },
                payer: { select: { id: true, name: true } },
                participants: {
                    where: { userId },
                    select: { share: true },
                },
            },
        });
    },

    async getUserSettlements(userId: number, cursor?: Date, limit = 20) {
        return prisma.settlement.findMany({
            where: {
                OR: [{ paidBy: userId }, { paidTo: userId }],
                ...(cursor && { createdAt: { lt: cursor } }),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                payer: { select: { id: true, name: true } },
                receiver: { select: { id: true, name: true } },
            },
        });
    },

    async getGroupsPreview(userId: number) {
        // 1. Get groups user belongs to
        const memberships = await prisma.groupMember.findMany({
            where: { userId },
            select: {
                group: {
                    select: {
                        id: true,
                        name: true,
                        members: {
                            select: {
                                user: {
                                    select: { avatar: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        const groupIds = memberships.map(m => m.group.id);

        if (!groupIds.length) return [];

        // 2. Get all expense shares involving user
        const shares = await prisma.expenseParticipant.findMany({
            where: {
                expense: { groupId: { in: groupIds } },
            },
            select: {
                userId: true,
                share: true,
                paidShare: true,
                expense: {
                    select: {
                        groupId: true,
                        paidBy: true,
                    },
                },
            },
        });

        // 3. Get settlements
        const settlements = await prisma.settlement.findMany({
            where: {
                groupId: { in: groupIds },
                OR: [{ paidBy: userId }, { paidTo: userId }],
            },
            select: {
                groupId: true,
                paidBy: true,
                paidTo: true,
                amount: true,
            },
        });

        // 4. Calculate balances
        const balances: Record<number, number> = {};

        for (const s of shares) {
            const gid = s.expense.groupId;
            balances[gid] ??= 0;

            // user paid for others
            if (s.expense.paidBy === userId && s.userId !== userId) {
                balances[gid] += Number(s.share);
            }

            // user owes payer
            if (s.userId === userId && s.expense.paidBy !== userId) {
                balances[gid] -= Number(s.share);
            }
        }

        for (const s of settlements) {
            balances[s.groupId] ??= 0;

            if (s.paidBy === userId) balances[s.groupId] += Number(s.amount);
            if (s.paidTo === userId) balances[s.groupId] -= Number(s.amount);
        }

        // 5. Format preview
        return memberships.map(m => ({
            id: m.group.id,
            name: m.group.name,
            balance: balances[m.group.id] ?? 0,
            memberAvatars: m.group.members
                .slice(0, 4)
                .map(mem => mem.user.avatar)
                .filter(Boolean),
        }));
    },
};
