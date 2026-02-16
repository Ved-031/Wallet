import express from 'express';
import userRoutes from '../modules/users/users.route.ts';

const router = express.Router();

router.use('/user', userRoutes);

export default router;
