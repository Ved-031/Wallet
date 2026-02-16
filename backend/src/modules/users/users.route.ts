import express from 'express';
import { authCallback } from './users.controller';

const router = express.Router();

router.post('/callback', authCallback);

export default router;
