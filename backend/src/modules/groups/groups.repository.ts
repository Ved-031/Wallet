import { GroupRole } from '@prisma/client';
import { prisma } from '../../config/prisma';

export const groupRepository = {
    async createGroup(name: string, userId: number) {
        return prisma.group.create({
            data: {
                name,
                createdBy: userId,
                members: {
                    create: {
                        userId,
                        role: GroupRole.ADMIN,
                    },
                },
            },
            include: {
                members: true,
            },
        });
    },

    async findUserGroups(userId: number) {
        return prisma.groupMember.findMany({
            where: { userId },
            include: {
                group: true,
            },
        });
    },

    async findGroupById(groupId: number) {
        return prisma.group.findUnique({
            where: { id: groupId },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, avatar: true },
                        },
                    },
                },
            },
        });
    },

    async removeMember(groupId: number, userId: number) {
        return prisma.groupMember.delete({
            where: {
                userId_groupId: { userId, groupId },
            },
        });
    },

    async getGroupActivity(groupId: number, userId: number, cursor?: Date, limit = 20) {
        const [expenses, settlements] = await Promise.all([
            // ALL EXPENSES
            prisma.expense.findMany({
                where: {
                    groupId,
                    ...(cursor && { createdAt: { lt: cursor } }),
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    payer: { select: { id: true, name: true, avatar: true } },
                    participants: {
                        include: {
                            user: { select: { id: true, name: true, avatar: true } },
                        },
                    },
                },
            }),

            // ONLY MY SETTLEMENTS
            prisma.settlement.findMany({
                where: {
                    groupId,
                    OR: [{ paidBy: userId }, { paidTo: userId }],
                    ...(cursor && { createdAt: { lt: cursor } }),
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    payer: { select: { id: true, name: true, avatar: true } },
                    receiver: { select: { id: true, name: true, avatar: true } },
                },
            }),
        ]);

        return { expenses, settlements };
    },
};
