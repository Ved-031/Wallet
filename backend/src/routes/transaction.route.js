import express from 'express';
import {
    createTransaction,
    getTransaction,
    deleteTransaction,
    getTransactionSummary
} from '../controllers/transaction.controller.js';

const router = express.Router();

router.post('/', createTransaction);
router.get('/:userId', getTransaction);
router.delete('/:id', deleteTransaction);
router.get('/summary/:userId', getTransactionSummary);

export default router;
