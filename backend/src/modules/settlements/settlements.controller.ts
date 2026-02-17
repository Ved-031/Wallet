import type { Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { settlementsService } from './settlements.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

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

export const getGroupSettlements = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const currentUserId = req.user!.id;
        const groupId = Number(req.params.groupId);

        const settlements = await settlementsService.getGroupSettlements(currentUserId, groupId);

        res.status(200).json(
            new ApiResponse({
                success: true,
                data: settlements,
            }),
        );
    },
);
