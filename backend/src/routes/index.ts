import express from 'express';
import userRoutes from '../modules/users/users.route';
import groupRoutes from '../modules/groups/groups.routes';
import transactionRoutes from '../modules/transactions/transactions.route';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/groups', groupRoutes);

export default router;
