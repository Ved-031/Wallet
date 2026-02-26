import type { Response } from 'express';
import { groupService } from './groups.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

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
export const createGroup = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { name } = req.body;

    const group = await groupService.createGroup(userId, name);

    res.status(201).json(
        new ApiResponse({
            success: true,
            data: group,
        }),
    );
});

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get all groups of logged-in user
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user groups
 */
export const getMyGroups = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const groups = await groupService.getUserGroups(userId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: groups,
        }),
    );
});

/**
 * @swagger
 * /groups/{groupId}:
 *   get:
 *     summary: Get group details
 *     tags: [Groups]
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
 *         description: Group details
 */
export const getGroupDetails = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const groupId = Number(req.params.id);

    const group = await groupService.getGroupDetails(userId, groupId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: group,
        }),
    );
});

/**
 * @swagger
 * /groups/{groupId}/leave:
 *   post:
 *     summary: Leave a group (only if balance is zero)
 *     tags: [Groups]
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
 *         description: Left group successfully
 *       400:
 *         description: Cannot leave group with pending balance
 */
export const leaveGroup = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const groupId = Number(req.params.groupId);

    const result = await groupService.leaveGroup(currentUserId, groupId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            ...result,
        }),
    );
});

/**
 * @swagger
 * /groups/{groupId}/members/{userId}:
 *   delete:
 *     summary: Admin removes a member from group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Member removed
 */
export const removeMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const groupId = Number(req.params.groupId);
    const targetUserId = Number(req.params.userId);

    const result = await groupService.removeMember(currentUserId, groupId, targetUserId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            ...result,
        }),
    );
});

export const getGroupActivity = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const groupId = Number(req.params.groupId);

    const result = await groupService.getGroupActivity(userId, groupId, req.query);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: result.activity,
            meta: {
                nextCursor: result.nextCursor,
                hasMore: result.hasMore,
            },
        }),
    );
});
