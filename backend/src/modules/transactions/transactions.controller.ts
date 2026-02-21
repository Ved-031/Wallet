import type { Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { transactionService } from './transactions.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a personal transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, amount, type]
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created
 */
export const createTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const transaction = await transactionService.create(userId, req.body);

    res.status(201).json(
        new ApiResponse({
            success: true,
            data: transaction,
        }),
    );
});

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get paginated transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Last transaction createdAt
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of transactions
 */
export const getTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const result = await transactionService.getAll(userId, req.query);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: result.transactions,
            meta: {
                nextCursor: result.nextCursor,
                hasMore: result.hasMore,
            },
        }),
    );
});

/**
 * @swagger
 * /transactions/${id}:
 *   get:
 *     summary: Get particular transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Transaction
 */
export const getTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const transaction = await transactionService.getById(userId, id);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: transaction,
        }),
    );
});

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Transaction updated
 */
export const updateTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const updated = await transactionService.update(userId, id, req.body);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: updated,
        }),
    );
});

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Transaction deleted
 */
export const deleteTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    await transactionService.delete(userId, Number(id));

    res.status(200).json(
        new ApiResponse({
            success: true,
            message: 'Transaction deleted successfully',
        }),
    );
});

/**
 * @swagger
 * /transactions/summary:
 *   get:
 *     summary: Get income expense summary
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved
 */
export const getSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const summary = await transactionService.getSummary(userId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: summary,
        }),
    );
});
