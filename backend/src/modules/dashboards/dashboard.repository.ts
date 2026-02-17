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
};
