import { prisma } from '../../config/prisma';

type ParticipantInput = {
    userId: number;
    share: number;
    paidShare: number;
};

export const expensesRepository = {
    async createExpense(
        groupId: number,
        paidBy: number,
        description: string,
        amount: number,
        participants: ParticipantInput[],
    ) {
        return prisma.expense.create({
            data: {
                groupId,
                paidBy,
                description,
                amount,
                participants: {
                    create: participants,
                },
            },
            include: {
                participants: true,
            },
        });
    },

    async getGroupMembers(groupId: number) {
        return prisma.groupMember.findMany({
            where: { groupId },
            select: { userId: true },
        });
    },

    async getGroupExpenses(groupId: number) {
        return prisma.expense.findMany({
            where: { groupId },
            orderBy: { createdAt: 'desc' },
            include: {
                payer: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, avatar: true },
                        },
                    },
                },
            },
        });
    },

    async getExpenseById(expenseId: number) {
        return prisma.expense.findUnique({
            where: { id: expenseId },
            include: {
                participants: true,
            },
        });
    },

    async deleteExpense(expenseId: number) {
        return prisma.expense.delete({
            where: { id: expenseId },
        });
    },

    async updateExpense(
        expenseId: number,
        groupId: number,
        paidBy: number,
        description: string,
        amount: number,
        participants: { userId: number; share: number; paidShare: number }[],
    ) {
        return prisma.$transaction(async tx => {
            // update expense
            await tx.expense.update({
                where: { id: expenseId },
                data: {
                    groupId,
                    paidBy,
                    description,
                    amount,
                },
            });

            // remove old splits
            await tx.expenseParticipant.deleteMany({
                where: { expenseId },
            });

            // insert new splits
            await tx.expenseParticipant.createMany({
                data: participants.map(p => ({
                    expenseId,
                    userId: p.userId,
                    share: p.share,
                    paidShare: p.paidShare,
                })),
            });

            return tx.expense.findUnique({
                where: { id: expenseId },
                include: { participants: true },
            });
        });
    },
};
