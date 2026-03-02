import { prisma } from '../../config/prisma';
import { serializeMessage } from '../../utils/NotificationMessage';
import { InviteStatus, NotificationType, Prisma, PrismaClient } from '@prisma/client';

export const invitesRepository = {
    async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async isMember(groupId: number, userId: number) {
        return prisma.groupMember.findUnique({
            where: {
                userId_groupId: { userId, groupId },
            },
        });
    },

    async createInvite(groupId: number, invitedBy: number, invitedUserId: number) {
        return prisma.groupInvite.create({
            data: {
                groupId,
                invitedBy,
                invitedUserId,
            },
        });
    },

    async createNotification(
        userId: number,
        type: NotificationType,
        title: string,
        message: string,
        meta?: any,
    ) {
        return prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message: serializeMessage(message, meta),
            },
        });
    },

    async getGroup(groupId: number) {
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
                creator: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
            },
        });
    },

    async getPendingInvites(userId: number) {
        return prisma.groupInvite.findMany({
            where: {
                invitedUserId: userId,
                status: InviteStatus.PENDING,
            },
            include: {
                group: { select: { id: true, name: true } },
                inviter: { select: { id: true, name: true, email: true, avatar: true } },
            },
        });
    },

    async getInviteById(inviteId: number) {
        return prisma.groupInvite.findUnique({
            where: { id: inviteId },
            include: {
                group: { select: { id: true, name: true } },
                inviter: { select: { id: true, name: true, email: true, avatar: true } },
                invited: { select: { id: true, name: true, email: true, avatar: true } },
            },
        });
    },

    async deleteInviteNotification(inviteId: number, db: Prisma.TransactionClient | PrismaClient = prisma) {
        return db.notification.deleteMany({
            where: {
                type: 'GROUP_INVITE',
                message: {
                    contains: `"inviteId":${inviteId}`
                }
            }
        });
    },

    async acceptInvite(inviteId: number) {
        return prisma.$transaction(async tx => {
            const invite = await tx.groupInvite.update({
                where: { id: inviteId },
                data: { status: InviteStatus.ACCEPTED },
            });

            await this.deleteInviteNotification(inviteId, tx);

            await tx.groupMember.create({
                data: {
                    groupId: invite.groupId,
                    userId: invite.invitedUserId,
                },
            });

            return invite;
        });
    },

    async declineInvite(inviteId: number) {
        return prisma.$transaction(async tx => {
            await tx.groupInvite.update({
                where: { id: inviteId },
                data: { status: InviteStatus.DECLINED },
            });

            await this.deleteInviteNotification(inviteId, tx);
        });
    },

    async getGroupPendingInvites(groupId: number) {
        return prisma.groupInvite.findMany({
            where: {
                groupId,
                status: InviteStatus.PENDING,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                invited: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                inviter: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    },
};
