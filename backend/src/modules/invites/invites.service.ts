import { AppError } from '../../utils/AppError';
import { NotificationType } from '@prisma/client';
import { invitesRepository } from './invites.repository';

export const invitesService = {
    async sendInvite(currentUserId: number, groupId: number, email: string) {
        if (!email || !email.includes('@')) throw new AppError('Invalid email', 400);

        // group must exist
        const group = await invitesRepository.getGroup(groupId);
        if (!group) throw new AppError('Group not found', 404);

        // inviter must be member
        const inviterMember = await invitesRepository.isMember(groupId, currentUserId);
        if (!inviterMember) throw new AppError('You are not part of this group', 403);

        // find invited user
        const invitedUser = await invitesRepository.findUserByEmail(email.toLowerCase());
        if (!invitedUser) throw new AppError('User with this email not found', 404);

        if (invitedUser.id === currentUserId) throw new AppError('You cannot invite yourself', 400);

        // already member?
        const alreadyMember = await invitesRepository.isMember(groupId, invitedUser.id);
        if (alreadyMember) throw new AppError('User is already in the group', 400);

        // create invite
        const invite = await invitesRepository.createInvite(groupId, currentUserId, invitedUser.id);

        // notify invited user
        await invitesRepository.createNotification(
            invitedUser.id,
            NotificationType.GROUP_INVITE,
            `${group.creator.name} invited you`,
            `Join ${group.name}`,
            {
                actorName: group.creator.name,
                actorAvatar: group.creator.avatar,
                groupName: group.name,
                inviteId: invite.id,
            }
        );

        return { message: 'Invite sent successfully' };
    },

    async getMyInvites(currentUserId: number) {
        return invitesRepository.getPendingInvites(currentUserId);
    },

    async acceptInvite(currentUserId: number, inviteId: number) {
        const invite = await invitesRepository.getInviteById(inviteId);

        if (!invite) throw new AppError('Invite not found', 404);

        if (invite.invitedUserId !== currentUserId) throw new AppError('Not your invite', 403);

        if (invite.status !== 'PENDING') throw new AppError('Invite already handled', 400);

        const accepted = await invitesRepository.acceptInvite(inviteId);

        await invitesRepository.createNotification(
            invite.invitedBy,
            NotificationType.INVITE_ACCEPTED,
            `${invite.invited.name} joined`,
            `${invite.group.name}`,
            {
                actorName: invite.invited.name,
                actorAvatar: invite.invited.avatar,
                groupName: invite.group.name,
            }
        );

        return accepted;
    },

    async declineInvite(currentUserId: number, inviteId: number) {
        const invite = await invitesRepository.getInviteById(inviteId);

        if (!invite) throw new AppError('Invite not found', 404);

        if (invite.invitedUserId !== currentUserId) throw new AppError('Not your invite', 403);

        if (invite.status !== 'PENDING') throw new AppError('Invite already handled', 400);

        const declined = await invitesRepository.declineInvite(inviteId);

        await invitesRepository.createNotification(
            invite.invitedBy,
            NotificationType.INVITE_DECLINED,
            `${invite.invited.name} declined`,
            `${invite.group.name}`,
            {
                actorName: invite.invited.name,
                actorAvatar: invite.invited.avatar,
                groupName: invite.group.name,
            }
        );

        return declined;
    },
};
