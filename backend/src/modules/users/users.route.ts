import express from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { authCallback, clerkWebhook, getDbUser } from './users.controller';

const router = express.Router();

router.get('/me', protectRoute, getDbUser);
router.post('/callback', authCallback);
router.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

export default router;
