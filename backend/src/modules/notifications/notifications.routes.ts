import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from './notifications.controller';

const router = Router();

router.use(protectRoute);
router.get('/', getMyNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);

export default router;
