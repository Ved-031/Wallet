import type { Response } from 'express';
import { expensesService } from './expenses.service';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const createExpense = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;

    const { groupId, description, amount, paidBy, splits } = req.body;

    const expense = await expensesService.createExpense(
        currentUserId,
        Number(groupId),
        description,
        Number(amount),
        Number(paidBy),
        splits,
    );

    res.status(201).json({
        success: true,
        data: expense,
    });
});

export const getGroupExpenses = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const groupId = Number(req.params.groupId);

    const expenses = await expensesService.getGroupExpenses(currentUserId, groupId);

    res.status(200).json({
        success: true,
        data: expenses,
    });
});

export const deleteExpense = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const expenseId = Number(req.params.id);

    await expensesService.deleteExpense(currentUserId, expenseId);

    res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
    });
});

export const updateExpense = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const expenseId = Number(req.params.id);

    const { groupId, description, amount, paidBy, splits } = req.body;

    const expense = await expensesService.updateExpense(
        currentUserId,
        expenseId,
        Number(groupId),
        description,
        Number(amount),
        Number(paidBy),
        splits,
    );

    res.status(200).json({
        success: true,
        data: expense,
    });
});
