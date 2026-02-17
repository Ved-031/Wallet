import type { Response } from 'express';
import { invitesService } from './invites.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

/**
 * @swagger
 * /invites:
 *   post:
 *     summary: Send group invite using email
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, email]
 *             properties:
 *               groupId:
 *                 type: number
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invite sent
 */
export const sendInvite = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const groupId = Number(req.params.groupId);
    const { email } = req.body;

    const result = await invitesService.sendInvite(currentUserId, groupId, email);

    res.status(200).json(
        new ApiResponse({
            success: true,
            ...result,
        }),
    );
});

/**
 * @swagger
 * /invites:
 *   get:
 *     summary: Get pending invites
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending invites
 */
export const getMyInvites = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;

    const invites = await invitesService.getMyInvites(currentUserId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            data: invites,
        }),
    );
});

/**
 * @swagger
 * /invites/{inviteId}/accept:
 *   post:
 *     summary: Accept a group invite
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Joined group
 */
export const acceptInvite = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const inviteId = Number(req.params.inviteId);

    const invite = await invitesService.acceptInvite(currentUserId, inviteId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            message: 'Joined group successfully',
            data: invite,
        }),
    );
});

/**
 * @swagger
 * /invites/{inviteId}/decline:
 *   post:
 *     summary: Decline a group invite
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Invite declined
 */
export const declineInvite = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user!.id;
    const inviteId = Number(req.params.inviteId);

    const invite = await invitesService.declineInvite(currentUserId, inviteId);

    res.status(200).json(
        new ApiResponse({
            success: true,
            message: 'Invite declined',
            data: invite,
        }),
    );
});
