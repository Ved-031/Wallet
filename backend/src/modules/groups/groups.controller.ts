import type { Response } from 'express';
import { groupService } from './groups.service';
import { asyncHandler } from '../../utils/AsyncHandler';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const createGroup = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { name } = req.body;

    const group = await groupService.createGroup(userId, name);

    res.status(201).json({
        success: true,
        data: group,
    });
});

export const getMyGroups = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const groups = await groupService.getUserGroups(userId);

    res.status(200).json({
        success: true,
        data: groups,
    });
});

export const getGroupDetails = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const groupId = Number(req.params.id);

    const group = await groupService.getGroupDetails(userId, groupId);

    res.status(200).json({
        success: true,
        data: group,
    });
});
