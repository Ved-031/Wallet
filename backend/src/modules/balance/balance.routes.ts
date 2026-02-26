import { Router } from 'express';
import { getGroupBalances, getSimplifiedSettlements } from './balance.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protectRoute);

router.get('/group/:groupId', getGroupBalances);
router.get('/group/:groupId/settlements', getSimplifiedSettlements);

export default router;
