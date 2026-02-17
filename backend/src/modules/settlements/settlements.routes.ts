import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { createSettlement, getGroupSettlements } from './settlements.controller';

const router = Router();

router.use(protectRoute);

router.post('/', createSettlement);
router.get('/group/:groupId', getGroupSettlements);

export default router;
