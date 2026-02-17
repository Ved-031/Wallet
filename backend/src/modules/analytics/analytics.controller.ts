import type { Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { analyticsService } from './analytics.service';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

/**
 * @swagger
 * /analytics/monthly:
 *   get:
 *     summary: Monthly spending graph
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Monthly analytics data
 */
export const getMonthlyAnalytics = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const year = Number(req.query.year) || new Date().getFullYear();
        const userId = req.user!.id;

        const data = await analyticsService.getMonthlySpending(userId, year);

        res.status(200).json(new ApiResponse({ data }));
    },
);

/**
 * @swagger
 * /analytics/category:
 *   get:
 *     summary: Category spending breakdown
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Category analytics
 */
export const getCategoryAnalytics = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id;

        const month = Number(req.query.month);
        const year = Number(req.query.year) || new Date().getFullYear();

        if (!month) return res.status(400).json({ message: 'Month is required' });

        const data = await analyticsService.getCategoryBreakdown(userId, month, year);

        res.status(200).json(new ApiResponse({ data }));
    },
);
