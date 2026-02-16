import type { Response } from 'express';
import { asyncHandler } from '../../utils/AsyncHandler';
import { transactionService } from './transactions.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const createTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const transaction = await transactionService.create(userId, req.body);

    res.status(201).json({
        success: true,
        data: transaction,
    });
});

export const getTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const transactions = await transactionService.getAll(userId);

    res.status(200).json({
        success: true,
        data: transactions,
    });
});

export const updateTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const updated = await transactionService.update(userId, id, req.body);

    res.status(200).json({
        success: true,
        data: updated,
    });
});

export const deleteTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    await transactionService.delete(userId, id);

    res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
    });
});

export const getSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const summary = await transactionService.getSummary(userId);

    res.status(200).json({
        success: true,
        data: summary,
    });
});
