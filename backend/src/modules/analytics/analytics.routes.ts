import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { getCategoryAnalytics, getMonthlyAnalytics } from './analytics.controller';

const router = Router();

router.use(protectRoute);

router.get('/monthly', getMonthlyAnalytics);
router.get('/category', getCategoryAnalytics);

export default router;
