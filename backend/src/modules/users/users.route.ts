import express from 'express';
import { authCallback, clerkWebhook } from './users.controller';

const router = express.Router();

router.post('/callback', authCallback);
router.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

export default router;
