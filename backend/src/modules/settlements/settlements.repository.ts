import { prisma } from '../../config/prisma';

export const settlementsRepository = {
    async createSettlement(
        groupId: number,
        paidBy: number,
        paidTo: number,
        amount: number,
        note?: string,
    ) {
        return prisma.settlement.create({
            data: {
                groupId,
                paidBy,
                paidTo,
                amount,
                note,
            },
        });
    },

    async getGroupMembers(groupId: number) {
        return prisma.groupMember.findMany({
            where: { groupId },
            select: { userId: true },
        });
    },

    async getGroupSettlements(groupId: number) {
        return prisma.settlement.findMany({
            where: { groupId },
            orderBy: { createdAt: 'desc' },
            include: {
                payer: { select: { id: true, name: true, avatar: true } },
                receiver: { select: { id: true, name: true, avatar: true } },
            },
        });
    },
};
