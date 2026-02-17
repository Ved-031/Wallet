import type { Response } from 'express';
import { balanceService } from './balance.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

/**
 * @swagger
 * /balance/group/{groupId}:
 *   get:
 *     summary: Get balances inside a group
 *     tags: [Balance]
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
 *         description: Group balances
 */
export const getGroupBalances = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const groupId = Number(req.params.groupId);

    const balances = await balanceService.getGroupBalances(currentUserId, groupId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: balances,
        })
    );
});
