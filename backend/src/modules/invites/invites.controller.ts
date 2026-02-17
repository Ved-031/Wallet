import type { Response } from 'express';
import { invitesService } from './invites.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

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
