import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import {
    createGroup,
    getMyGroups,
    getGroupDetails,
    leaveGroup,
    removeMember,
    deleteGroup,
    getGroupActivity
} from './groups.controller';

const router = Router();

router.use(protectRoute);

router.post('/', createGroup);
router.get('/', getMyGroups);
router.get('/:id', getGroupDetails);
router.delete('/:groupId', deleteGroup);
router.post('/:groupId/leave', leaveGroup);
router.get('/:groupId/activity', getGroupActivity);
router.delete('/:groupId/members/:userId', removeMember);

export default router;
