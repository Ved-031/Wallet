import { Router } from 'express';
import { createExpense } from './expenses.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protectRoute);

router.post('/', createExpense);

export default router;
