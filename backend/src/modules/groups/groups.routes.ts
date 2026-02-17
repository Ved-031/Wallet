import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { createGroup, getMyGroups, getGroupDetails, leaveGroup, removeMember } from './groups.controller';

const router = Router();

router.use(protectRoute);

router.post('/', createGroup);
router.get('/', getMyGroups);
router.get('/:id', getGroupDetails);
router.post('/:groupId/leave', leaveGroup);
router.delete('/:groupId/members/:userId', removeMember);

export default router;
