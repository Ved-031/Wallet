import type { Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { dashboardService } from './dashboard.service';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get overall financial summary (personal + group balances)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved
 */
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

/**
 * @swagger
 * /dashboard/debts:
 *   get:
 *     summary: Get who user owes and who owes user
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Debt overview retrieved
 */
export const getDashboardDebts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const debts = await dashboardService.getDebts(userId);

    res.status(200).json(
        new ApiResponse({
            data: debts,
        }),
    );
});

/**
 * @swagger
 * /dashboard/activity:
 *   get:
 *     summary: Get recent activity feed (expenses + settlements)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Activity feed
 */
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
