import express from 'express';
import userRoutes from '../modules/users/users.route';
import groupRoutes from '../modules/groups/groups.routes';
import inviteRoutes from '../modules/invites/invites.routes';
import balanceRoutes from '../modules/balance/balance.routes';
import expenseRoutes from '../modules/expenses/expenses.routes';
import settlementRoutes from '../modules/settlements/settlements.routes';
import transactionRoutes from '../modules/transactions/transactions.route';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/groups', groupRoutes);
router.use('/expenses', expenseRoutes);
router.use('/settlements', settlementRoutes);
router.use('/balance', balanceRoutes);
router.use('/invites', inviteRoutes);

export default router;
