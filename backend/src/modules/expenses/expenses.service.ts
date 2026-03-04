import { AppError } from '../../utils/AppError';
import { NotificationType } from '@prisma/client';
import { expensesRepository } from './expenses.repository';
import { sendUserPush } from '../../utils/push/sendUserPush';
import { notificationsRepository } from '../notifications/notifications.repository';

type SplitInput = {
    userId: number;
    amount: number;
};

export const expensesService = {
    async createExpense(
        currentUserId: number,
        groupId: number,
        description: string,
        amount: number,
        paidBy: number,
        splits: SplitInput[],
    ) {
        if (!description || description.trim().length < 2)
            throw new AppError('Invalid description', 400);

        if (amount <= 0) throw new AppError('Amount must be greater than 0', 400);

        if (!splits || splits.length === 0) throw new AppError('Splits required', 400);

        // get group members
        const members = await expensesRepository.getGroupMembers(groupId);
        const memberIds = new Set(members.map(m => m.userId));

        // creator must be member
        if (!memberIds.has(currentUserId))
            throw new AppError('You are not part of this group', 403);

        // payer must be member
        if (!memberIds.has(paidBy)) throw new AppError('Payer not in group', 400);

        // validate split users
        for (const s of splits) {
            if (!memberIds.has(s.userId)) throw new AppError(`User ${s.userId} not in group`, 400);
        }

        // validate total
        const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);

        if (Number(totalSplit.toFixed(2)) !== Number(amount.toFixed(2)))
            throw new AppError('Split amounts must equal total expense', 400);

        // prepare participants
        const participants = splits.map(s => ({
            userId: s.userId,
            share: s.amount,
            paidShare: s.userId === paidBy ? amount : 0,
        }));

        // save
        const expense = await expensesRepository.createExpense(
            groupId,
            paidBy,
            description.trim(),
            amount,
            participants,
        );

        // get group members with user data
        const groupMembers = await expensesRepository.getGroupMembersWithUser(groupId);

        // payer info
        const payer = groupMembers.find(m => m.userId === paidBy)?.user;

        // notify everyone except payer
        for (const member of groupMembers) {
            if (member.userId === paidBy) continue;

            const user = member.user;

            // create DB notification
            await notificationsRepository.createNotification(
                user.id,
                NotificationType.EXPENSE_ADDED,
                `${payer?.name} added an expense`,
                description,
                {
                    actorName: payer?.name,
                    actorAvatar: payer?.avatar,
                    groupId,
                    expenseId: expense.id,
                    amount,
                },
            );

            // send push
            await sendUserPush(
                user,
                'New Expense Added',
                `${payer?.name} added ₹${amount} in the group`,
                {
                    type: 'EXPENSE_ADDED',
                    groupId,
                    expenseId: expense.id,
                },
            );
        }

        return expense;
    },

    async getGroupExpenses(currentUserId: number, groupId: number, query: any) {
        const members = await expensesRepository.getGroupMembers(groupId);
        const memberIds = new Set(members.map(m => m.userId));

        if (!memberIds.has(currentUserId))
            throw new AppError('You are not part of this group', 403);

        const limit = Math.min(Number(query.limit) || 20, 50);
        const cursor = query.cursor ? new Date(query.cursor) : undefined;

        const expenses = await expensesRepository.getGroupExpenses(groupId, cursor, limit);

        const nextCursor =
            expenses.length === limit ? expenses[expenses.length - 1].createdAt : null;

        return {
            expenses,
            nextCursor,
            hasMore: !!nextCursor,
        };
    },

    async deleteExpense(currentUserId: number, expenseId: number) {
        const expense = await expensesRepository.getExpenseById(expenseId);

        if (!expense) throw new AppError('Expense not found', 404);

        if (expense.paidBy !== currentUserId)
            throw new AppError('Only payer can delete expense', 403);

        return expensesRepository.deleteExpense(expenseId);
    },

    async updateExpense(
        currentUserId: number,
        expenseId: number,
        groupId: number,
        description: string,
        amount: number,
        paidBy: number,
        splits: { userId: number; amount: number }[],
    ) {
        const existing = await expensesRepository.getExpenseById(expenseId);

        if (!existing) throw new AppError('Expense not found', 404);

        // only payer can edit
        if (existing.paidBy !== currentUserId)
            throw new AppError('Only payer can edit expense', 403);

        if (!description || description.trim().length < 2)
            throw new AppError('Invalid description', 400);

        if (amount <= 0) throw new AppError('Amount must be greater than 0', 400);

        if (!splits || splits.length === 0) throw new AppError('Splits required', 400);

        // verify group members
        const members = await expensesRepository.getGroupMembers(groupId);
        const memberIds = new Set(members.map(m => m.userId));

        if (!memberIds.has(paidBy)) throw new AppError('Payer not in group', 400);

        for (const s of splits) {
            if (!memberIds.has(s.userId)) throw new AppError(`User ${s.userId} not in group`, 400);
        }

        // validate total
        const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);

        if (Number(totalSplit.toFixed(2)) !== Number(amount.toFixed(2)))
            throw new AppError('Split amounts must equal total expense', 400);

        // prepare participants
        const participants = splits.map(s => ({
            userId: s.userId,
            share: s.amount,
            paidShare: s.userId === paidBy ? amount : 0,
        }));

        return expensesRepository.updateExpense(
            expenseId,
            groupId,
            paidBy,
            description.trim(),
            amount,
            participants,
        );
    },
};
