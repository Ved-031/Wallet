import { AppError } from '../../utils/AppError';
import { NotificationType } from '@prisma/client';
import { sendUserPush } from '../../utils/push/sendUserPush';
import { settlementsRepository } from './settlements.repository';
import { notificationsRepository } from '../notifications/notifications.repository';

export const settlementsService = {
    async createSettlement(
        currentUserId: number,
        groupId: number,
        paidBy: number,
        paidTo: number,
        amount: number,
        note?: string,
    ) {
        if (amount <= 0) throw new AppError('Amount must be greater than 0', 400);

        if (paidBy === paidTo) throw new AppError('Cannot settle with yourself', 400);

        // group membership check
        const members = await settlementsRepository.getGroupMembers(groupId);
        const memberIds = new Set(members.map(m => m.userId));

        if (!memberIds.has(currentUserId))
            throw new AppError('You are not part of this group', 403);

        if (!memberIds.has(paidBy) || !memberIds.has(paidTo))
            throw new AppError('Users must belong to group', 400);

        const settlement = await settlementsRepository.createSettlement(
            groupId,
            paidBy,
            paidTo,
            amount,
            note?.trim(),
        );

        const payer = await settlementsRepository.getUserBasic(paidBy);
        const receiver = await settlementsRepository.getUserBasic(paidTo);
        const group = await settlementsRepository.getGroupBasic(groupId);

        await notificationsRepository.createNotification(
            paidTo,
            NotificationType.SETTLEMENT,
            'Settlement received',
            `${payer?.name} paid you ₹${amount}`,
            {
                actorId: paidBy,
                actorName: payer?.name,
                actorAvatar: payer?.avatar,
                amount,
                groupId,
                groupName: group?.name,
            },
        );

        if (receiver) {
            await sendUserPush(
                receiver,
                'Settlement Received',
                `${payer?.name} paid you ₹${amount} in ${group?.name}`,
                {
                    type: 'SETTLEMENT',
                    groupId,
                    amount,
                },
            );
        }

        return settlement;
    },

    async getGroupSettlements(currentUserId: number, groupId: number, query: any) {
        const members = await settlementsRepository.getGroupMembers(groupId);
        const memberIds = new Set(members.map(m => m.userId));

        if (!memberIds.has(currentUserId))
            throw new AppError('You are not part of this group', 403);

        const limit = Math.min(Number(query.limit) || 20, 50);
        const cursor = query.cursor ? new Date(query.cursor) : undefined;

        const settlements = await settlementsRepository.getGroupSettlements(
            groupId,
            currentUserId,
            cursor,
            limit,
        );

        const nextCursor =
            settlements.length === limit ? settlements[settlements.length - 1].createdAt : null;

        return {
            settlements,
            nextCursor,
            hasMore: !!nextCursor,
        };
    },
};
