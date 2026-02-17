import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware';
import { createExpense, deleteExpense, getGroupExpenses, updateExpense } from './expenses.controller';

const router = Router();

router.use(protectRoute);

router.post('/', idempotencyMiddleware, createExpense);
router.get('/group/:groupId', getGroupExpenses);
router.delete('/:id', deleteExpense);
router.patch('/:id', updateExpense);

export default router;
