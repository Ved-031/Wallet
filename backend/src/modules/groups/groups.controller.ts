import type { Response } from 'express';
import { groupService } from './groups.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

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
