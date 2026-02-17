import type { Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { dashboardService } from './dashboard.service';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const getDashboardSummary = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id;

        const summary = await dashboardService.getSummary(userId);

        res.status(200).json(
            new ApiResponse({
                data: summary,
            }),
        );
    },
);

export const getDashboardDebts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const debts = await dashboardService.getDebts(userId);

    res.status(200).json(
        new ApiResponse({
            data: debts,
        }),
    );
});

export const getDashboardActivity = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id;

        const result = await dashboardService.getActivity(userId, req.query);

        res.status(200).json(
            new ApiResponse({
                data: result.activity,
                meta: {
                    nextCursor: result.nextCursor,
                    hasMore: result.hasMore,
                },
            }),
        );
    },
);
