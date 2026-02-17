import { prisma } from '../../config/prisma';

export const balanceRepository = {
    async getGroupMembers(groupId: number) {
        return prisma.groupMember.findMany({
            where: { groupId },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
            },
        });
    },

    async getExpenseParticipants(groupId: number) {
        return prisma.expenseParticipant.findMany({
            where: {
                expense: { groupId },
            },
        });
    },

    async getSettlements(groupId: number) {
        return prisma.settlement.findMany({
            where: { groupId },
        });
    },
};
