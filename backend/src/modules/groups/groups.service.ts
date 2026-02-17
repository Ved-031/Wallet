import { AppError } from '../../utils/AppError';
import { groupRepository } from './groups.repository';

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
};
