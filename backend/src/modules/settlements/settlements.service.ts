import { AppError } from '../../utils/AppError';
import { settlementsRepository } from './settlements.repository';

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

        return settlementsRepository.createSettlement(
            groupId,
            paidBy,
            paidTo,
            amount,
            note?.trim(),
        );
    },

    async getGroupSettlements(currentUserId: number, groupId: number) {
        const members = await settlementsRepository.getGroupMembers(groupId);
        const memberIds = new Set(members.map(m => m.userId));

        if (!memberIds.has(currentUserId))
            throw new AppError('You are not part of this group', 403);

        return settlementsRepository.getGroupSettlements(groupId);
    },
};
