import type { Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { settlementsService } from './settlements.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

/**
 * @swagger
 * /settlements:
 *   post:
 *     summary: Record a settlement payment
 *     tags: [Settlements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, paidTo, amount]
 *             properties:
 *               groupId:
 *                 type: number
 *               paidTo:
 *                 type: number
 *               amount:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Settlement recorded
 */
export const createSettlement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const { groupId, paidBy, paidTo, amount, note } = req.body;

    const settlement = await settlementsService.createSettlement(
        currentUserId,
        Number(groupId),
        Number(paidBy),
        Number(paidTo),
        Number(amount),
        note,
    );

    res.status(201).json(
        new ApiResponse({
            success: true,
            data: settlement,
        }),
    );
});

/**
 * @swagger
 * /settlements/group/{groupId}:
 *   get:
 *     summary: Get settlement history of group
 *     tags: [Settlements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Settlement history
 */
export const getGroupSettlements = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const currentUserId = req.user!.id;
        const groupId = Number(req.params.groupId);

        const result = await settlementsService.getGroupSettlements(
            currentUserId,
            groupId,
            req.query,
        );

        res.status(200).json(
            new ApiResponse({
                success: true,
                data: result.settlements,
                meta: {
                    nextCursor: result.nextCursor,
                    hasMore: result.hasMore,
                },
            }),
        );
    },
);
