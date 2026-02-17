import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { createGroup, getMyGroups, getGroupDetails } from './groups.controller';

const router = Router();

router.use(protectRoute);

router.post('/', createGroup);
router.get('/', getMyGroups);
router.get('/:id', getGroupDetails);

export default router;
