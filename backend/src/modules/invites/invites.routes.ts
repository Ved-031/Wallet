import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { acceptInvite, declineInvite, getMyInvites, getPendingInvites, sendInvite } from './invites.controller';

const router = Router();

router.use(protectRoute);

router.post('/:groupId', sendInvite);
router.get('/:groupId/pending-invites', getPendingInvites);
router.get('/', getMyInvites);
router.post('/:inviteId/accept', acceptInvite);
router.post('/:inviteId/decline', declineInvite);

export default router;
