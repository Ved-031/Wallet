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
};
