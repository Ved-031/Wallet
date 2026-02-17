import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { getDashboardActivity, getDashboardDebts, getDashboardSummary } from './dashboard.controller';

const router = Router();

router.use(protectRoute);

router.get('/summary', getDashboardSummary);
router.get('/debts', getDashboardDebts);
router.get('/activity', getDashboardActivity);

export default router;
