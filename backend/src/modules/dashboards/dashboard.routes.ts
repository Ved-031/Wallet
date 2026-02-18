import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { getDashboardActivity, getDashboardDebts, getDashboardSummary, getGroupsPreview } from './dashboard.controller';

const router = Router();

router.use(protectRoute);

router.get('/summary', getDashboardSummary);
router.get('/debts', getDashboardDebts);
router.get('/activity', getDashboardActivity);
router.get('/groups-preview', getGroupsPreview);

export default router;
