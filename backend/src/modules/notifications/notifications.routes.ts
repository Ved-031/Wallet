import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import {
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    registerPushToken,
    disablePush,
    togglePush,
} from './notifications.controller';

const router = Router();

router.use(protectRoute);
router.get('/', getMyNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);
router.post('/push-token', registerPushToken);
router.post('/disable', disablePush);
router.patch('/toggle', togglePush);

export default router;
