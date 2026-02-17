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
};
