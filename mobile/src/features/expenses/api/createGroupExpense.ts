import { api } from '@/core/api/axios';
import { CreateExpenseDto } from '../types';

export const createGroupExpense = async (data: CreateExpenseDto) => {
    const res = await api.post('/expenses', data);
    return res.data.data;
};
