import type { Response } from 'express';
import { balanceService } from './balance.service';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const getGroupBalances = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const groupId = Number(req.params.groupId);

    const balances = await balanceService.getGroupBalances(currentUserId, groupId);

    res.status(200).json({
        success: true,
        data: balances,
    });
});
