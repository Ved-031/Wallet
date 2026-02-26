import { AppError } from '../../utils/AppError';
import { groupRepository } from './groups.repository';
import { balanceService } from '../balance/balance.service';

export const groupService = {
    async createGroup(userId: number, name: string) {
        if (!name || name.trim().length < 2) {
            throw new AppError('Group name must be at least 2 characters', 400);
        }

        return groupRepository.createGroup(name.trim(), userId);
    },

    async getUserGroups(userId: number) {
        const memberships = await groupRepository.findUserGroups(userId);

        // return only group data
        return memberships.map(m => ({
            id: m.group.id,
            name: m.group.name,
            createdAt: m.group.createdAt,
        }));
    },

    async getGroupDetails(userId: number, groupId: number) {
        const group = await groupRepository.findGroupById(groupId);

        if (!group) {
            throw new AppError('Group not found', 404);
        }

        // check membership
        const isMember = group.members.some(m => m.userId === userId);

        if (!isMember) {
            throw new AppError('You are not a member of this group', 403);
        }

        return group;
    },

    async leaveGroup(currentUserId: number, groupId: number) {
        const balances = await balanceService.getGroupBalances(currentUserId, groupId);

        const me = balances.find(b => b.userId === currentUserId);

        if (!me) throw new AppError('You are not part of this group', 404);

        if (me.balance !== 0)
            throw new AppError('You cannot leave group until all debts are settled', 400);

        await groupRepository.removeMember(groupId, currentUserId);

        return { message: 'You left the group' };
    },

    async removeMember(currentUserId: number, groupId: number, targetUserId: number) {
        const group = await groupRepository.findGroupById(groupId);
        if (!group) throw new AppError('Group not found', 404);

        const me = group.members.find(m => m.userId === currentUserId);
        if (!me || me.role !== 'ADMIN') throw new AppError('Only admin can remove members', 403);

        const balances = await balanceService.getGroupBalances(currentUserId, groupId);
        const target = balances.find(b => b.userId === targetUserId);

        if (!target) throw new AppError('User not in group', 404);

        if (target.balance !== 0)
            throw new AppError('Cannot remove user with pending balances', 400);

        await groupRepository.removeMember(groupId, targetUserId);

        return { message: 'Member removed successfully' };
    },

    async getGroupActivity(userId: number, groupId: number, query: any) {
        const cursor = query.cursor ? new Date(query.cursor) : undefined;
        const limit = Math.min(Number(query.limit) || 20, 50);

        const { expenses, settlements } = await groupRepository.getGroupActivity(
            groupId,
            userId,
            cursor,
            limit,
        );

        const mappedExpenses = expenses.map(e => ({
            id: `exp_${e.id}`,
            type: 'EXPENSE',
            createdAt: e.createdAt,
            data: e,
        }));

        const mappedSettlements = settlements.map(s => ({
            id: `set_${s.id}`,
            type: 'SETTLEMENT',
            createdAt: s.createdAt,
            data: s,
        }));

        const feed = [...mappedExpenses, ...mappedSettlements]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit);

        const last = feed[feed.length - 1];

        return {
            activity: feed,
            nextCursor: last?.createdAt ?? null,
            hasMore: feed.length === limit,
        };
    },
};
