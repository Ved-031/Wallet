import type { Response } from 'express';
import { expensesService } from './expenses.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { saveIdempotentResponse } from '../../utils/SaveIdempotentResponse';

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a group expense (equal or unequal split)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, amount, participants]
 *             properties:
 *               groupId:
 *                 type: number
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               participants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [userId, share]
 *                   properties:
 *                     userId:
 *                       type: number
 *                     share:
 *                       type: number
 *     responses:
 *       201:
 *         description: Expense created
 */
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

    const response = new ApiResponse({
        message: 'Expense created',
        data: expense,
    });

    if (res.locals.idempotencyKey) {
        await saveIdempotentResponse(res.locals.idempotencyKey, currentUserId, response);
    }

    res.status(201).json(response);
});

/**
 * @swagger
 * /expenses/group/{groupId}:
 *   get:
 *     summary: Get expenses of a group (paginated)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Group expenses list
 */
export const getGroupExpenses = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const groupId = Number(req.params.groupId);

    const result = await expensesService.getGroupExpenses(currentUserId, groupId, req.query);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: result.expenses,
            meta: {
                nextCursor: result.nextCursor,
                hasMore: result.hasMore,
            },
        }),
    );
});

/**
 * @swagger
 * /expenses/{expenseId}:
 *   patch:
 *     summary: Update expense (only payer allowed)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Expense updated
 */
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

    res.status(200).json(
        new ApiResponse({
            data: expense,
            success: true,
        }),
    );
});

/**
 * @swagger
 * /expenses/{expenseId}:
 *   delete:
 *     summary: Delete expense (only payer allowed)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Expense deleted
 */
export const deleteExpense = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const expenseId = Number(req.params.id);

    await expensesService.deleteExpense(currentUserId, expenseId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            message: 'Expense deleted successfully',
        }),
    );
});
