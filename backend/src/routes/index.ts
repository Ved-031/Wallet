import express from 'express';
import userRoutes from '../modules/users/users.route';

const router = express.Router();

router.use('/user', userRoutes);

export default router;
