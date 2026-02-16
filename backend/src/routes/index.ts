import express from 'express';
import userRoutes from '../modules/users/users.route';
import transactionRoutes from '../modules/transactions/transactions.route';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/transactions', transactionRoutes);

export default router;
