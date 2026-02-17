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
