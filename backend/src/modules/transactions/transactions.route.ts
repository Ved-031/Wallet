import { Router } from 'express';
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getSummary,
} from './transactions.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protectRoute);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
