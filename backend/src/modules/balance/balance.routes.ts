import { Router } from 'express';
import { getGroupBalances } from './balance.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protectRoute);

router.get('/group/:groupId', getGroupBalances);

export default router;
