import { prisma } from '../../config/prisma';
import { InviteStatus, NotificationType } from '@prisma/client';

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

    async createNotification(userId: number, title: string, message: string) {
        return prisma.notification.create({
            data: {
                userId,
                type: NotificationType.GROUP_INVITE,
                title,
                message,
            },
        });
    },

    async getGroup(groupId: number) {
        return prisma.group.findUnique({
            where: { id: groupId },
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
        });
    },

    async acceptInvite(inviteId: number) {
        return prisma.$transaction(async tx => {
            const invite = await tx.groupInvite.update({
                where: { id: inviteId },
                data: { status: InviteStatus.ACCEPTED },
            });

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
        return prisma.groupInvite.update({
            where: { id: inviteId },
            data: { status: InviteStatus.DECLINED },
        });
    },

    async notifyInviter(userId: number, message: string) {
        return prisma.notification.create({
            data: {
                userId,
                type: NotificationType.GROUP_INVITE,
                title: 'Group Invite Update',
                message,
            },
        });
    },
};
